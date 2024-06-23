const mongoose = require('mongoose')

const InterestImageSchema = new mongoose.Schema({
	imageId: String,
	url: String,
	optimized: String,
	format: String,
	cropped: String,
	author: String,
	authorUrl: String
})

const InterestSchema = new mongoose.Schema({
	title: String,
	description: String,
	photo: InterestImageSchema,
	public: {
		type: Boolean,
		default: true
	},
	categoryId: {
		type: mongoose.ObjectId,
		ref: 'category'
	},
	owner: mongoose.ObjectId || null,
	system: Boolean,
	seeded: Boolean
}, { timestamps: true })

module.exports = mongoose.model('interest', InterestSchema)