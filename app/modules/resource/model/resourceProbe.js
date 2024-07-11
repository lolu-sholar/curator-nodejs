const mongoose = require('mongoose')
const { ProbeStatusType } = require('../types')

const ResourceProbeImageSchema = new mongoose.Schema({
	imageId: String,
	url: String,
	optimized: String,
	format: String,
	cropped: String
})

const ResourceProbeSchema = new mongoose.Schema({
	probeId: String,
	title: String,
	description: String,
	coverImage: String,
	url: String,
	platform: String,
	processedImage: ResourceProbeImageSchema || null,
	status: {
		type: String,
		enum: ProbeStatusType
	},
	owner: mongoose.ObjectId || null
}, { timestamps: true })

module.exports = mongoose.model('resourceProbe', ResourceProbeSchema)