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
router.post(route.create, authorize.hard, validate.sync(dto.createQueue), controller.createQueue)

exports.sync = () => config.getApp().use(route.group, router)