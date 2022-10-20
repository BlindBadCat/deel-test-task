const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const { Op } = require("sequelize");
const joiValidate = require('./middleware/joiValidate'); 
const joiValidationSchemas = require('./joiValidationSchemas');



const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get(
  '/contracts/:id',
  [
    getProfile,
    joiValidate(joiValidationSchemas.contractorId)
  ],
  async (req, res) =>{
    const {Contract} = req.app.get('models');
    const {id} = req.params;
    const {profile} = req;
    const contract = await Contract.findOne(
      {
        where: {
          id,
          [Op.or]: [
            { ClientId: profile.id },
            { ContractorId: profile.id }
          ]
        }
      }
    );
    if(!contract) return res.status(404).end()
    res.json(contract)
})

app.get(
  '/contracts',
  [
    getProfile,
  ],
  async (req, res) =>{
    const {Contract} = req.app.get('models');
    const {profile} = req;
    const contracts = await Contract.findAll(
      {
        where: {
          [Op.or]: [
            { ClientId: profile.id },
            { ContractorId: profile.id }
          ],
          status: {
            [Op.not]: 'terminated'
          }
        }
      }
    );
    if(!contracts) return res.status(404).end()
    res.json(contracts)
})


app.get(
  '/jobs/unpaid',
  [
    getProfile,
  ],
  async (req, res) =>{
    const {Job, Contract} = req.app.get('models');
    const {profile} = req;
    const jobs = await Job.findAll(
      {
        where: {
          paid: {
            [Op.not]: true
          }
        },
        include: [{
          model: Contract,
          where: {
            [Op.or]: [
              { ClientId: profile.id },
              { ContractorId: profile.id }
            ],
            status: {
              [Op.not]: 'terminated'
            }
          }
         }]
      }
    );
    if(!jobs) return res.status(404).end()
    res.json(jobs)
});


app.post(
  '/jobs/:job_id/pay',
  [
    getProfile,
  ],
  async (req, res) =>{

    const {Job, Contract, Profile} = req.app.get('models');
    const {job_id} = req.params;
    const {profile} = req;

    if (profile.type !== 'Client') {
      res.status(400).end();
    }

    const result = sequelize.transaction( async (transaction) => {
      try {
        const job = await Job.findOne(
          {
            where: {
              id: job_id,
              paid: {
                [Op.not]: true
              }
            },
            // Don't allow users to pay for the jobs that don't belongs to their contracts
            include: [{
              model: Contract,
              as: ['contract'],
              where: {
                [Op.or]: [
                  { ClientId: profile.id },
                ],
              }
             }],
          },
          transaction
        );

        if(!job) return res.status(400).end();
        if (profile.balance < job.price) {
          return res.status(400).end();
        }
        
        // add funds to the contractor
        await Profile.increment(
          { balance: job.price },
          { 
            where: { id: job.contract.contractorId },
            transaction: t 
          }
        );

        // remove funds from the client
        await Profile.increment(
          { balance: -job.price },
          { 
            where: { id: profile.id },
            transaction: t 
          },
        );

        // update the job
        await Job.update(
          { 
            paid: true,
            paymentDate: new Date()
          },
          {
            where: { id: job.id }, 
            transaction: t 
          },
        );

        return res.status(200).end();

      } catch (e) {
        console.log(e);
      }
    });
});



app.post(
  '/balances/deposit/:userId',
  [
    getProfile,
    //TODO: add validation for userId
  ],
  async (req, res) =>{
    const {Job, Profile, Contract} = req.app.get('models');
    const {userId} = req.params;

    const { amount } = req.body;

    const client = await Profile.findOne({ 
      where: { id:  userId } 
    });
    if (!client) {
      res.status(404).end();
    }

    await sequelize.transaction(async (transaction) => {
      const amountToPayTotal = await Job.sum('price', {
        where: {
          paid: {
            [Op.not]: true
          }
        },
        include: {
          model: Contract,
          required: true,
          where: { 
            ClientId: userId,
            status: {
              [Op.not]: 'terminated'
            },
          },
          required: true,
        },
        transaction,
      });
      
  
      if (!amountToPayTotal) {
        res.status(400).end();
      }
  
      if (amountToPayTotal / 4 < amount) {
        res.status(400).end();
      }
  
      await Profile.increment(
        { balance: amount },
        {
          where: { id: userId }, 
          transaction 
        },
      );
    });
    res.status(200).end();
});


module.exports = app;
