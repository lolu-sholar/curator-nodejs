const { cipher } = require('../../utils')
const { FinalResponse } = require('../../utils/response')
const service = require('./service')

class QueueController {
	constructor(){}

	// Create queue
	async createQueue(req, res) {
		try {
			const status = await service.createQueue(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}
}

module.exports = new QueueController()