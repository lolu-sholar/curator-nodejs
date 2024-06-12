const { cipher } = require('../../utils')
const service = require('./service')

class CategoryController {
	constructor(){}

	// Get all category list
	async getCategoryList(req, res) {
		try {
			const status = await service.getCategoryList()

			if (status.error)
				return res.status(status.code).send(status.message)

			res.json(status)
		} catch {
			res.sendStatus(500)
		}
	}

	// Create category
	async createCategory(req, res) {
		try {
			const status = await service.createCategory(req.body)

			if (status.error)
				return res.status(status.code).send(status.message)

			res.json(status)
		} catch {
			res.sendStatus(500)
		}
	}

	// Follow category
	async followCategory(req, res) {
		try {
			const status = await service.followCategory(req.body)

			if (status.error)
				return res.status(status.code).send(status.message)

			res.json(status)
		} catch {
			res.sendStatus(500)
		}
	}

	// Invite to follow category
	async inviteToFollow(req, res) {
		try {
			const status = await service.inviteToFollow(req.body)

			if (status.error)
				return res.status(status.code).send(status.message)

			res.json(status)
		} catch {
			res.sendStatus(500)
		}
	}
}

module.exports = new CategoryController()