const mongoose = require('mongoose')

const CategoryImageSchema = new mongoose.Schema({
	imageId: String,
	url: String,
	optimized: String,
	format: String,
	cropped: String,
	author: String,
	authorUrl: String
})

const CategorySchema = new mongoose.Schema({
	title: String,
	description: String,
	photo: CategoryImageSchema,
	public: {
		type: Boolean,
		default: true
	},
	owner: mongoose.ObjectId || null,
	system: Boolean,
	seeded: Boolean
}, { timestamps: true })

module.exports = mongoose.model('category', CategorySchema)