const crypto = require('crypto')
const config = require('../manager/config')

// Generate code
exports.code = (length) => {
	const array = new BigUint64Array(1)
	return crypto.webcrypto.getRandomValues(array).toString().substr(0, length || 6)
}

// Log debug data in dev mode
exports.LogDev = (...data) => {
	if (config.env().STAGE == 'dev')
		console.debug(...data)
}

// Log data
exports.log = (...data) => console.log(...data)

// Log error
exports.error = (...data) => console.error(...data)

// Log debug data
exports.debug = (res, ...data) => {
	res.sendStatus(500)
	console.debug(...data)
}

// Generate random uuid
exports.uuid = () => {
	return crypto.randomUUID()
}

// Generate random uuid / clean
exports.uuidClean = () => {
	return crypto.randomUUID().replace(/-/g, '')
}

// Validator
exports.Validator = {
  email(data) {
    return data.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/)
  }
}