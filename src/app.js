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
module.exports = app;
