const { cipher } = require('../../utils')
const { FinalResponse } = require('../../utils/response')
const service = require('./service')

class InterestController {
	constructor(){}

	// Get all public interests
	async getPublicInterestsList(req, res) {
		try {
			const status = await service.getPublicInterestsList(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Get all public interests for category
	async getPublicInterestsForCategory(req, res) {
		try {
			const status = await service.getPublicInterestsForCategory(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Create interest
	async createInterest(req, res) {
		try {
			const status = await service.createInterest(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Follow interest
	async followInterest(req, res) {
		try {
			const status = await service.followInterest(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Invite to follow interest
	async inviteToFollow(req, res) {
		try {
			const status = await service.inviteToFollow(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Process invite
	async processInvite(req, res) {
		try {
			const status = await service.processInvitation(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Settle invitation
	async settleInvitation(req, res) {
		try {
			const status = await service.processInvitation({
				...req.body,
				authByInvitation: true
			})

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}
}

module.exports = new InterestController()