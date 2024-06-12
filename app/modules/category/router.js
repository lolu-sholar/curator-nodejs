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
router.get(route.getList, authorize.easy, controller.getCategoryList)
router.post(route.create, authorize.hard, validate.sync(dto.createCategory, ['photo']), controller.createCategory)
router.put(route.follow, authorize.hard, validate.sync(dto.followCategory), controller.followCategory)
router.put(route.invite, authorize.hard, validate.sync(dto.inviteToFollow), controller.inviteToFollow)

exports.sync = () => config.getApp().use(route.group, router)