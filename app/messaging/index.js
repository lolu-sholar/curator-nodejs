exports.server = require('./connection')

const dispatcher = require('./dispatcher')

// Agendas
const notificationAgenda = require('../modules/notification/messaging')

exports.jobs = {
	sync() {
		notificationAgenda.sync()
	}
}

exports.dispatcher = dispatcher
exports.types = require('./types')