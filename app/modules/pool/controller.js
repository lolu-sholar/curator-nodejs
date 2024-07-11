const { cipher } = require('../../utils')
const { FinalResponse } = require('../../utils/response')
const service = require('./service')

class PoolController {
	constructor(){}

	// Create pool
	async createPool(req, res) {
		try {
			const status = await service.createPool(req.body)

			return new FinalResponse(status, res)
		} catch {
			res.sendStatus(500)
		}
	}
}

module.exports = new PoolController()