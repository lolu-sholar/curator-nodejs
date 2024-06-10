const { cipher } = require('../../utils')
const service = require('./service')

// Register user
const register = async(req, res) => {
	try {
		const status = await service.userRegistration(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Verify email address
const verifyEmail = async(req, res) => {
	try {
		const status = await service.verifyEmailAddress(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Resend verification code
const resendVerificationCode = async(req, res) => {
	try {
		const status = await service.resendVerificationCode(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Forgot password
const forgotPassword = async(req, res) => {
	try {
		const status = await service.generatePasswordResetCode(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Sign user in
const login = async(req, res) => {
	try {
		const status = await service.signUserIn(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Resend password reset code
const resendPasswordResetCode = async(req, res) => {
	try {
		const status = await service.resendPasswordResetCode(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Reset password
const resetPassword = async(req, res) => {
	try {
		const status = await service.resetPassword(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

module.exports = {
	register,
	verifyEmail,
	resendVerificationCode,
	login,
	forgotPassword,
	resendPasswordResetCode,
	resetPassword
}