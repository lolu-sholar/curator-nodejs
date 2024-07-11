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
router.get(route.getList, authorize.easy, controller.getPublicCollectionsList)
router.get(route.getListForInterest, authorize.easy, validate.syncQuery(dto.getCollectionsForInterest), controller.getPublicCollectionsForInterest)
router.post(route.create, authorize.hard, validate.sync(dto.createCollection, ['photo']), controller.createCollection)
router.put(route.follow, authorize.hard, validate.sync(dto.followCollection), controller.followCollection)
router.put(route.invite, authorize.hard, validate.sync(dto.inviteToFollow), controller.inviteToFollow)
router.get(route.processInvite, authorize.easy, validate.syncQuery(dto.activateInvitation), controller.processInvite)
router.post(route.settleInvite, authorize.easy, validate.sync(dto.authByInvitation), controller.settleInvitation)

exports.sync = () => config.getApp().use(route.group, router)