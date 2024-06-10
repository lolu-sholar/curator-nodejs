const express = require('express')
const route = require('./route')
const controller = require('./controller')
const config = require('../../manager/config')

// Define router
const router = express.Router()

// Map routes
router.get(route.lig, controller.lifeIsGood)

exports.sync = () => config.getApp().use(route.group, router)