const { connection } = require('./connection')
const { cipher } = require('../utils')
const { NotificationChannelType } = require('./types')

// Do job / now
exports.announce = (payload) => {
	connection()
		.now(payload?.channel ?? NotificationChannelType.Default, payload)
}

// Do job / later
exports.announceLater = (payload) => {
	connection()
		.schedule(payload.when, payload?.channel ?? NotificationChannelType.Default, payload)
}