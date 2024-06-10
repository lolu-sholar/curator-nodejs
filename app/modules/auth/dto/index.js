const Joi = require('@hapi/joi')

exports.register = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required()
})

exports.verifyEmail = Joi.object({
  code: Joi.string().required(),
  email: Joi.string().email().required(),
  token: Joi.string().required()
})

exports.resendCode = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required()
})

exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required()
})

exports.forgotPassword = Joi.object({
  email: Joi.string().email().required()
})

exports.resetPassword = Joi.object({
  code: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  token: Joi.string().required()
})