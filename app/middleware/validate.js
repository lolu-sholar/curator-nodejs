const { cipher } = require('../utils')

module.exports = {
	sync(schema, exempt) {
		return (req, res, next) => {
			// Decrypted data
			const data = cipher.encryptOrDecryptData(req.body, true, exempt)
			// Validate schema
			const { error } = schema.validate(data)

			// Check for error
			if (error)
				return res.status(400).send(error.details[0].message)

			// Add data to request body
			req.body = data

			next()
		}
	}
}