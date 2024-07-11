const { cipher } = require('../../utils')
const { FinalResponse } = require('../../utils/response')
const service = require('./service')

class ResourceController {
	constructor(){}

	// Get all public resources for interest
	async getPublicResourcesForInterest(req, res) {
		try {
			const status = await service.getPublicResourcesForInterest(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Verify and probe resource url
	async probeResourceUrl(req, res) {
		try {
			const status = await service.verifyAndProbeResourceUrl(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Get probe statys
	async getProbeStatus(req, res) {
		try {
			const status = await service.getResourceProbeStatus(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Create resource
	async createResource(req, res) {
		try {
			const status = await service.createResource(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Like/unlike resource
	async likeResource(req, res) {
		try {
			const status = await service.likeResource(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Get comments for resource
	async getComments(req, res) {
		try {
			const status = await service.getComments(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Get comments for comment
	async getCommentChildren(req, res) {
		try {
			const status = await service.getCommentChildren(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Make comment on resource/resource comment
	async makeComment(req, res) {
		try {
			const status = await service.makeComment(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Update comment
	async updateComment(req, res) {
		try {
			const status = await service.updateComment(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Like/unlike comment
	async likeComment(req, res) {
		try {
			const status = await service.likeComment(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}

	// Delete comment
	async deleteComment(req, res) {
		try {
			const status = await service.deleteCommentt(req.query)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}
}

module.exports = new ResourceController()