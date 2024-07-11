const mongoose = require('mongoose')

const ResourceImageSchema = new mongoose.Schema({
	imageId: String,
	url: String,
	optimized: String,
	format: String,
	cropped: String
})

const ResourceSchema = new mongoose.Schema({
	title: String,
	titleCustom: String,
	description: String,
	descriptionCustom: String,
	resourceOrigin: String,
	resourceOriginHost: String,
	resourceOriginPlatform: String,
	photo: ResourceImageSchema || null,
	actualCoverImageUrl: String,
	public: {
		type: Boolean,
		default: true
	},
	probeId: {
		type: mongoose.ObjectId,
		ref: 'resourceProbe'
	},
	interestId: {
		type: mongoose.ObjectId,
		ref: 'interest'
	},
	collectionId: mongoose.ObjectId || null,
	owner: mongoose.ObjectId || null,
	system: Boolean
}, { timestamps: true })

module.exports = mongoose.model('resource', ResourceSchema)