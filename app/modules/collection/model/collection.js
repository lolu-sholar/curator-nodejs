const mongoose = require('mongoose')

const CollectionImageSchema = new mongoose.Schema({
	imageId: String,
	url: String,
	optimized: String,
	format: String,
	cropped: String,
	author: String,
	authorUrl: String
})

const CollectionSchema = new mongoose.Schema({
	title: String,
	description: String,
	photo: CollectionImageSchema,
	public: {
		type: Boolean,
		default: true
	},
	interestId: {
		type: mongoose.ObjectId,
		ref: 'interest'
	},
	owner: mongoose.ObjectId || null,
	system: Boolean
}, { timestamps: true })

module.exports = mongoose.model('collection', CollectionSchema)