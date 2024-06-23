const mongoose = require('mongoose')

const InterestFollowerSchema = new mongoose.Schema({
	interestId: {
		type: mongoose.ObjectId,
		ref: 'interest'
	},
	followerId: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

module.exports = mongoose.model('interestFollower', InterestFollowerSchema)