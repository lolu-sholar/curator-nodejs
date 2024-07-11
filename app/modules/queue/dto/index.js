const Joi = require('@hapi/joi')

exports.createQueue = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  visible: Joi.string().valid('true', 'false').required()
})