const Joi = require('joi') 
const schemas = { 
  contractorId: Joi.object({
    params: Joi.object({
      id: Joi.string().pattern(/^[0-9]*$/).required(),
    }).unknown(true)
  }).unknown(true),
  // define all the other schemas below 
}; 
module.exports = schemas;