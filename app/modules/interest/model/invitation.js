const mongoose = require('mongoose')

const InterestInvitationSchema = new mongoose.Schema({
	interestId: {
		type: mongoose.ObjectId,
		ref: 'interest'
	},
	inviterId: {
		type: mongoose.ObjectId,
		ref: 'user'
	},
	inviteeEmail: String,
	isInviteeKnown: Boolean,
	inviteAccepted: Boolean
}, { timestamps: true })

module.exports = mongoose.model('interestInvitation', InterestInvitationSchema)