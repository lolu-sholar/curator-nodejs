const mongoose = require('mongoose')

const QueueResourceSchema = new mongoose.Schema({
	queueId: {
		type: mongoose.ObjectId,
		ref: 'queue'
	},
	resourceId: {
		type: mongoose.ObjectId,
		ref: 'resource'
	}
}, { timestamps: true })

module.exports = mongoose.model('queueResource', QueueResourceSchema)