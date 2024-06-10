const express = require('express')
const dotenv = require('dotenv')

// Define env object
let envObject = {}

// Define express app holder
let app = express()

// Load environment values
const loadEnvironmentValues = () => dotenv.config()
const loadReplaceEnvironmentValues = () => {
	// Adjust based on environment
	if (process.env.STAGE != 'dev') {
		process.env.MONGO_URI = process.env.MONGO_URI_LIVE
	}

	// Pass environment values
	envObject = process.env
}

exports.sync = () => {
	// Load env
	loadEnvironmentValues()
	loadReplaceEnvironmentValues()
}

exports.getApp = () => app

exports.env = () => envObject