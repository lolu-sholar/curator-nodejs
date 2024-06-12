const mongoose = require('mongoose')

const CategoryFollowerSchema = new mongoose.Schema({
	categoryId: {
		type: mongoose.ObjectId,
		ref: 'category'
	},
	followerId: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

exports.CategoryFollower = mongoose.model('categoryFollower', CategoryFollowerSchema)