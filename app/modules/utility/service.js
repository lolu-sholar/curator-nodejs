const { cipher } = require('../../utils')

class UtilityService {
	constructor(){}

	// Show hello message
	async hello(req, res) {
		res.json({ message: `Hello World! ${new Date()}` })
	}

	// Encrypt/decrypt payload
	async transformPayload(req, res) {
		try {
			const payload = req.body
			const decrypt = req.query.hasOwnProperty('decrypt')

			const value = cipher.encryptOrDecryptData(payload, decrypt)

			res.json({
				data: value ?? '{}'
			})
		} catch(err) {
			res.status(400).send(err.toString())
		}
	}
}

module.exports = new UtilityService()