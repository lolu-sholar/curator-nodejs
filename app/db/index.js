const mongoose = require('mongoose')
const config = require('../manager/config')

// Connect to db
exports.connect = () => {
	mongoose.connect(config.env().MONGO_URI)
	mongoose.connection.on('open', () => console.log("[STATUS:MONGO] Connected!"))
	mongoose.connection.on('error', () => console.error("[ERROR:MONGO] Connection error!"))
}

// Disconnect from db
exports.disconnect = () => {
	mongoose.disconnect()
}