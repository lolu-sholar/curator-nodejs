const mongoose = require('mongoose')

const ResourceLikeSchema = new mongoose.Schema({
	resourceId: {
		type: mongoose.ObjectId,
		ref: 'resource'
	},
	likedBy: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

module.exports = mongoose.model('resourceLike', ResourceLikeSchema)