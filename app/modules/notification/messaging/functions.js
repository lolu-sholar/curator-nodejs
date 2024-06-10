const service = require('../service')

// Perform email jobs
exports.doEmailJob = (data) => {
	// Send to service
	service.sendMail(data)
}

// Perform socket jobs
exports.doSocketJob = (data) => {
}