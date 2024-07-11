const Joi = require('@hapi/joi')

exports.getResourcesForInterest = Joi.object({
  interestId: Joi.string().required()
})

exports.probeResourceUrl = Joi.object({
  url: Joi.string().uri().required(),
  wait: Joi.string().valid('true', 'false').required()
})

exports.getProbeStatus = Joi.object({
  probeId: Joi.string().required()
})

exports.createResource = Joi.object({
  probeId: Joi.string().required(),
  title: Joi.string(),
  description: Joi.string(),
  coverImageData: Joi.string(),
  public: Joi.string().valid('true', 'false').required(),
  interestId: Joi.string().required(),
})

exports.likeResource = Joi.object({
  resourceId: Joi.string().required(),
  like: Joi.string().valid('true', 'false').required()
})

exports.makeComment = Joi.object({
  resourceId: Joi.string().required(),
  commentId: Joi.string(),
  comment: Joi.string().required()
})

exports.updateComment = Joi.object({
  commentId: Joi.string().required(),
  comment: Joi.string().required()
})

exports.likeComment = Joi.object({
  commentId: Joi.string().required(),
  like: Joi.string().valid('true', 'false').required()
})

exports.deleteComment = Joi.object({
  commentId: Joi.string().required()
})

exports.getComments = Joi.object({
  resourceId: Joi.string().required()
})

exports.getCommentChildren = Joi.object({
  commentId: Joi.string().required()
})