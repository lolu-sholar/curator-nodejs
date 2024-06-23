const { cipher, jtoken, helpers, futureDate, env, cloudinary, currentUser } = require('../../utils')
const { Ok, Issue, Rebuke } = require('../../utils/response')
const { Interest, InterestFollower, InterestInvitation } = require('./model')
const config = require('../../manager/config')
const { dispatcher, types } = require('../../messaging')

class InterestService {
	constructor(){}

	// Get one interest
	async findOne(condition) {
		try {
			return await Interest.findOne(condition)
		} catch {
			return null
		}
	}

	// Seed system interests
	async seedSystemInterests(interests) {
		try {
			// Check if data
			if (interests.length) {
				// Save interests
				await Interest.insertMany(interests)
				
				console.log(`[STATUS:INTEREST] Default system interests have just been seeded.`)
			}
		} catch(err) {}
	}
}


module.exports = new InterestService()