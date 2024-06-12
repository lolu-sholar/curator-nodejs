const { cipher } = require('../../utils')
const { connection } = require('../../messaging/connection')

class ProfileController {
	constructor(){}

	// Life is good message
	async lifeIsGood(req, res) {
		try {
			res.status(200).send('Life is good!')
		} catch {
			res.sendStatus(500)
		}
	}
}

module.exports = new ProfileController()