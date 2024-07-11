const mongoose = require('mongoose')

const ResourceCommentSchema = new mongoose.Schema({
	resourceId: {
		type: mongoose.ObjectId,
		ref: 'resource'
	},
	parentCommentId: mongoose.ObjectId || null,
	comment: String,
	edited: Boolean,
	commentBy: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

module.exports = mongoose.model('resourceComment', ResourceCommentSchema)