const mongoose = require('mongoose')

const QueueSchema = new mongoose.Schema({
	name: String,
	description: String,
	visible: Boolean,
	owner: mongoose.ObjectId || null,
	general: Boolean
}, { timestamps: true })

module.exports = mongoose.model('queue', QueueSchema)