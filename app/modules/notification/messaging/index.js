const { connection } = require('../../../messaging/connection')
const types = require('../../../messaging/types')
const functions = require('./functions')

exports.sync = () => {
	// All jobs
	connection()
		.define(types.NotificationChannelType.Default, async job => {
			// Dispatch to functions
			functions.doEmailJob(job.attrs.data)
			functions.doSocketJob(job.attrs.data)
		})

	// Email jobs
	connection()
		.define(types.NotificationChannelType.Email, async job => {
			// Dispatch to function / email
			functions.doEmailJob(job.attrs.data)
		})

	// Socket jobs
	connection()
		.define(types.NotificationChannelType.Socket, async job => {
			// Dispatch to function / socket
			functions.doSocketJob(job.attrs.data)
		})
}