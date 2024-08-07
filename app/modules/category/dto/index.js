const Joi = require('@hapi/joi')

exports.createCategory = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  public: Joi.string().valid('true', 'false').required(),
  photo: Joi.string().dataUri().required()
})

exports.followCategory = Joi.object({
  categoryId: Joi.string().required(),
  follow: Joi.string().valid('true', 'false').required()
})

exports.inviteToFollow = Joi.object({
  categoryId: Joi.string().required(),
  email: Joi.string().email().required()
})

exports.authByInvitation = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6).max(30).required(),
  iv: Joi.string().required()
})

exports.activateInvitation = Joi.object({
  iv: Joi.string().required()
})