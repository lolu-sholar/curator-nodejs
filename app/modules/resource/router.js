const express = require('express')
const route = require('./route')
const controller = require('./controller')
const config = require('../../manager/config')
const validate = require('../../middleware/validate')
const authorize = require('../../middleware/authorize')
const dto = require('./dto')

// Define router
const router = express.Router()

// Map routes
router.get(route.getListForInterest, authorize.easy, validate.syncQuery(dto.getResourcesForInterest), controller.getPublicResourcesForInterest)

// Middleware group
router.use([
	route.probe,
	route.getProbeStatus,
	route.createResource,
	route.likeResource,
	route.makeComment,
	route.updateComment
], authorize.hard)

router.put(route.probe, validate.sync(dto.probeResourceUrl), controller.probeResourceUrl)
router.get(route.getProbeStatus, validate.syncQuery(dto.getProbeStatus), controller.getProbeStatus)
router.post(route.createResource, validate.sync(dto.createResource), controller.createResource)
router.put(route.likeResource, validate.sync(dto.likeResource), controller.likeResource)
router.get(route.getComments, authorize.easy, validate.syncQuery(dto.getComments), controller.getComments)
router.get(route.getCommentChildren, authorize.easy, validate.syncQuery(dto.getCommentChildren), controller.getCommentChildren)
router.post(route.makeComment, validate.sync(dto.makeComment), controller.makeComment)
router.put(route.updateComment, validate.sync(dto.updateComment), controller.updateComment)
router.put(route.likeComment, validate.sync(dto.likeComment), controller.likeComment)
router.delete(route.deleteComment, validate.syncQuery(dto.deleteComment), controller.deleteComment)

exports.sync = () => config.getApp().use(route.group, router)