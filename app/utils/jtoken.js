const jwt = require('jsonwebtoken')
const config = require('../manager/config')

// Create signature
exports.create = (data, expiresIn) => {
	return jwt.sign(data, config.env().CRYPTOJS_NEEDLE, { expiresIn: expiresIn ?? '1m' })
}

// Verify signature
exports.verify = async (signature) => {
	let result = await new Promise(resolve => {
		jwt.verify(signature, config.env().CRYPTOJS_NEEDLE, (err, decoded) => {
			resolve((err) ? null : decoded)
		})
	})
	return result
}