const { cipher } = require('../../utils')
const { FinalResponse } = require('../../utils/response')
const service = require('./service')

class AuthController {
	constructor(){}

	// Register user
	async register(req, res) {
		try {
			const status = await service.userRegistration(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Verify email address
	async verifyEmail(req, res) {
		try {
			const status = await service.verifyEmailAddress(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Resend verification code
	async resendVerificationCode(req, res) {
		try {
			const status = await service.resendVerificationCode(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Forgot password
	async forgotPassword(req, res) {
		try {
			const status = await service.generatePasswordResetCode(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Sign user in
	async login(req, res) {
		try {
			const status = await service.signUserIn(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Resend password reset code
	async resendPasswordResetCode(req, res) {
		try {
			const status = await service.resendPasswordResetCode(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Reset password
	async resetPassword(req, res) {
		try {
			const status = await service.resetPassword(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}
}

module.exports = new AuthController()