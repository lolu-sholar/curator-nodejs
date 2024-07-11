const mongoose = require('mongoose')

const ResourceCommentLikeSchema = new mongoose.Schema({
	commentId: {
		type: mongoose.ObjectId,
		ref: 'resourceComment'
	},
	likedBy: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

module.exports = mongoose.model('resourceCommentLike', ResourceCommentLikeSchema)