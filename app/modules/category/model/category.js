const mongoose = require('mongoose')

const CategoryImageSchema = new mongoose.Schema({
	imageId: String,
	url: String,
	optimized: String,
	format: String,
	cropped: String
})

const CategorySchema = new mongoose.Schema({
	title: String,
	description: String,
	photo: CategoryImageSchema,
	public: {
		type: Boolean,
		default: true
	},
	owner: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

exports.Category = mongoose.model('category', CategorySchema)