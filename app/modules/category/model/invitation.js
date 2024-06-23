const mongoose = require('mongoose')

const CategoryInvitationSchema = new mongoose.Schema({
	categoryId: {
		type: mongoose.ObjectId,
		ref: 'category'
	},
	inviterId: {
		type: mongoose.ObjectId,
		ref: 'user'
	},
	inviteeEmail: String,
	isInviteeKnown: Boolean,
	inviteAccepted: Boolean
}, { timestamps: true })

module.exports = mongoose.model('categoryInvitation', CategoryInvitationSchema)