const Joi = require('@hapi/joi')

exports.createPool = Joi.object({
  name: Joi.string().required(),
  description: Joi.string()
})