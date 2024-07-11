const mongoose = require('mongoose')

const CollectionFollowerSchema = new mongoose.Schema({
	collectionId: {
		type: mongoose.ObjectId,
		ref: 'collection'
	},
	followerId: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

module.exports = mongoose.model('collectionFollower', CollectionFollowerSchema)