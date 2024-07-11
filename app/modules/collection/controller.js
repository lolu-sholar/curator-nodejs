const { cipher } = require('../../utils')
const { FinalResponse } = require('../../utils/response')
const service = require('./service')

class CollectionController {
	constructor(){}

	// Get all public collections
	async getPublicCollectionsList(req, res) {
		try {
			const status = await service.getPublicCollectionsList(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Get all public collections for interest
	async getPublicCollectionsForInterest(req, res) {
		try {
			const status = await service.getPublicCollectionsForInterest(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Create collection
	async createCollection(req, res) {
		try {
			const status = await service.createCollection(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Follow collection
	async followCollection(req, res) {
		try {
			const status = await service.followCollection(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Invite to follow collection
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

module.exports = new CollectionController()