const { cipher } = require('../../utils')

// Show hello message
const hello = async(req, res) => res.json({ message: `Hello World! ${new Date()}` })

// Encrypt/decrypt payload
const transformPayload = async(req, res) => {
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

module.exports = {
	transformPayload,
	hello
}