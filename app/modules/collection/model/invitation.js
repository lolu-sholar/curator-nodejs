const mongoose = require('mongoose')

const CollectionInvitationSchema = new mongoose.Schema({
	collectionId: {
		type: mongoose.ObjectId,
		ref: 'collection'
	},
	inviterId: {
		type: mongoose.ObjectId,
		ref: 'user'
	},
	inviteeEmail: String,
	isInviteeKnown: Boolean,
	inviteAccepted: Boolean
}, { timestamps: true })

module.exports = mongoose.model('collectionInvitation', CollectionInvitationSchema)