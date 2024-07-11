const { cipher } = require('../../utils')
const { FinalResponse } = require('../../utils/response')
const service = require('./service')

class CategoryController {
	constructor(){}

	// Get all public category list
	async getPublicCategoryList(req, res) {
		try {
			const status = await service.getPublicCategoryList()

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Create category
	async createCategory(req, res) {
		try {
			const status = await service.createCategory(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Follow category
	async followCategory(req, res) {
		try {
			const status = await service.followCategory(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Invite to follow category
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

module.exports = new CategoryController()