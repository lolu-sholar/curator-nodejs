const { cipher } = require('../utils')
const config = require('../manager/config')

module.exports = {
	sync(schema, exempt) {
		return (req, res, next) => {
			// Decrypted data
			const data = (config.env().STAGE != 'dev' || config.env().PAYLOAD_SECURE)
				? cipher.encryptOrDecryptData(req.body, true, exempt) : req.body
			// Validate schema
			const { error } = schema.validate(data)

			// Check for error
			if (error)
				return res.status(400).send({ code: 400, message: error.details[0].message.replace(/"/g, "'") })

			// Add data to request body
			req.body = data

			next()
		}
	},
	syncQuery(schema, exempt) {
		return (req, res, next) => {
			// Decrypted data
			const data = (config.env().STAGE != 'dev' || config.env().PAYLOAD_SECURE)
				? cipher.encryptOrDecryptData(req.query, true, [...exempt, 'pageNumber', 'pageLimit']) : req.query
			// Validate schema
			const { error } = schema.validate(data)

			// Check for error
			if (error)
				return res.status(400).send({ code: 400, message: error.details[0].message.replace(/"/g, "'") })

			// Add data to request query
			req.query = data

			next()
		}
	}
}