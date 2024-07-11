const mongoose = require('mongoose')

const PoolSchema = new mongoose.Schema({
	name: String,
	description: String,
	owner: mongoose.ObjectId || null
}, { timestamps: true })

module.exports = mongoose.model('pool', PoolSchema)