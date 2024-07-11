const mongoose = require('mongoose')

const PoolResourceSchema = new mongoose.Schema({
	poolId: {
		type: mongoose.ObjectId,
		ref: 'pool'
	},
	resourceId: {
		type: mongoose.ObjectId,
		ref: 'resource'
	}
}, { timestamps: true })

module.exports = mongoose.model('poolResource', PoolResourceSchema)