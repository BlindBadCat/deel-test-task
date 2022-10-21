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
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const { profile } = req;
    const contract = await Contract.findOne(
      {
        where: {
          id,
          [Op.or]: [
            { ClientId: profile.id },
            { ContractorId: profile.id },
          ],
        },
      },
    );
    if (!contract) {
      return res.status(404).end()
    }
    return res.json(contract)
})

app.get(
  '/contracts',
  [
    getProfile,
  ],
  async (req, res) =>{
    const { Contract } = req.app.get('models');
    const { profile } = req;
    const contracts = await Contract.findAll(
      {
        where: {
          [Op.or]: [
            { ClientId: profile.id },
            { ContractorId: profile.id },
          ],
          status: {
            [Op.not]: 'terminated',
          },
        },
      },
    );
    if (!contracts) {
      return res.status(404).end();
    }
    return res.json(contracts);
})


app.get(
  '/jobs/unpaid',
  [
    getProfile,
  ],
  async (req, res) =>{
    const { Job, Contract } = req.app.get('models');
    const { profile } = req;
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
            },
          },
         }],
      },
    );
    if (!jobs) {
      return res.status(404).end();
    }
    res.json(jobs);
});


app.post(
  '/jobs/:job_id/pay',
  [
    getProfile,
  ],
  async (req, res) =>{

    const { Job, Contract, Profile } = req.app.get('models');
    const { job_id} = req.params;
    const { profile} = req;

    if (profile.type !== 'client') {
      return res.status(400).end();
      
    }

    await sequelize.transaction( async (transaction) => {
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
                 ClientId: profile.id 
              }
             }],
          },
          transaction
        );

        if (!job) {
          return res.status(400).end();
          
        }
        
        if (profile.balance < job.price) {
          return res.status(400).end();
        }
        
        // add funds to the contractor
        await Profile.increment(
          { balance: job.price },
          { 
            where: { id: job.Contract.ContractorId },
            transaction,
          }
        );

        // remove funds from the client
        await Profile.increment(
          { balance: -job.price },
          { 
            where: { id: profile.id },
            transaction,
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
            transaction,
          },
        );
        console.log('paid');

      } catch (e) {
        console.log(e);
      }
    });
    
    return res.status(200).end();
});



app.post(
  '/balances/deposit/:userId',
  [
    getProfile,
    //TODO: add validation for userId
  ],
  async (req, res) =>{
    const { Job, Profile, Contract } = req.app.get('models');
    const { userId } = req.params;

    const { amount } = req.body;

    const client = await Profile.findOne({ 
      where: { id:  userId } 
    });
    if (!client) {
      return res.status(404).end();
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
        return res.status(400).end();
      }
  
      if (amountToPayTotal / 4 < amount) {
        return res.status(400).end();
      }
  
      await Profile.increment(
        { balance: amount },
        {
          where: { id: userId }, 
          transaction 
        },
      );
    });
    return res.status(200).end();
});



app.get(
  '/admin/best-profession',
  [
    getProfile,
    //TODO: add queri validation and ADMIN AUTH
  ],
  async (req, res) =>{
    const { Job, Profile, Contract } = req.app.get('models');
    const { start, end } = req.query;

    // Assuming that validation is implemented with Joi middleware
    const startDate = new Date(start);
    const endDate = new Date(end)
    const profession = await Profile.findOne({
      attributes: [
        'profession',
        [sequelize.fn('sum', sequelize.col('Contractor.Jobs.price')), 'total'],
      ],
      where: {
        type: 'contractor'
      },
      include: {
        model: Contract,
        required: true,
        attributes: [],
        as: 'Contractor',
        include: {
          model: Job,
          required: true,
          attributes: [],
          where: {
            paymentDate: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
            paid: true,
          },
        },
      },
      group: 'profession',
      order: [
        [sequelize.col('total'), 'DESC'],
      ],
      subQuery: false,
    });

    return res.json(profession)
});

app.get(
  '/admin/best-clients',
  [
    getProfile,
    //TODO: add queri validation and ADMIN AUTH
  ],
  async (req, res) =>{
    const { Job, Profile, Contract } = req.app.get('models');
    const { start, end, limit } = req.query;

    // Assuming that validation is implemented with Joi middleware
    const startDate = new Date(start);
    const endDate = new Date(end)
    const clients = await Profile.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        [sequelize.fn('sum', sequelize.col('Client.Jobs.price')), 'paid'],
      ],
      where: {
        type: 'client',
      },
      include: {
        model: Contract,
        required: true,
        attributes: [],
        as: 'Client',
        include: {
          model: Job,
          required: true,
          attributes: [],
          where: {
            paymentDate: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
            paid: true,
          },
        },
      },
      group: ['Profile.id'],
      order: [
        [sequelize.col('paid'), 'DESC'],
      ],
      limit: limit || 2,
      subQuery: false,
    });
    console.log(clients)

    return res.json(
      clients.map(
        ({dataValues}) => {
          const { id, lastName, firstName, paid } = dataValues;

          return { 
            id, 
            fullName: `${firstName} ${lastName}`, 
            paid 
          };
        }));
});


module.exports = app;
