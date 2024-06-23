const { connection } = require('./connection')
const { cipher } = require('../utils')
const { NotificationChannelType } = require('./types')

// Do job / now
exports.announce = (payload) => {
	payload = Array.isArray(payload) ? payload : [payload]
	payload.forEach(p => {
		connection()
			.now(p?.channel ?? NotificationChannelType.Default, p)
	})
}

// Do job / later
exports.announceLater = (payload) => {
	payload = Array.isArray(payload) ? payload : [payload]
	payload.forEach(p => {
		connection()
			.schedule(p.when, p?.channel ?? NotificationChannelType.Default, p)
	})
}