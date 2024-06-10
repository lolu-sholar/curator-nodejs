const express = require('express')
const route = require('./route')
const controller = require('./controller')
const config = require('../../manager/config')
const validate = require('../../middleware/validate')
const dto = require('./dto')

// Define router
const router = express.Router()

// Map routes
router.post(route.register, validate.sync(dto.register), controller.register)
router.put(route.verifyEmail, validate.sync(dto.verifyEmail), controller.verifyEmail)
router.put(route.resendVerificationCode, validate.sync(dto.resendCode), controller.resendVerificationCode)
router.post(route.login, validate.sync(dto.login), controller.login)
router.put(route.forgotPassword, validate.sync(dto.forgotPassword), controller.forgotPassword)
router.put(route.resendPasswordResetCode, validate.sync(dto.resendCode), controller.resendPasswordResetCode)
router.post(route.resetPassword, validate.sync(dto.resetPassword), controller.resetPassword)

exports.sync = () => config.getApp().use(route.group, router)