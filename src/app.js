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
})

module.exports = app;
