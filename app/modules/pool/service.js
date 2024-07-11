const { cipher, jtoken, helpers, futureDate, env, cloudinary, currentUser } = require('../../utils')
const { Ok, Rebuke } = require('../../utils/response')
const { Pool } = require('./model')
const config = require('../../manager/config')
const authService = require('../auth/service')
const profileService = require('../profile/service')
const route = require('./route')
const { dispatcher, types } = require('../../messaging')

class PoolService {
	constructor(){}

	// Create pool
	async createPool(payload) {
		try {
			// Get pool with name
			const poolDuplicate = await Pool.findOne({
				name: payload.name,
				owner: currentUser.get('oid')
			})

			// Check if exists
			if (poolDuplicate)
				return new Rebuke('You have an existing pool already with the same name.')

			// Create pool document
			const pool = new Pool({
				name: payload.name,
				description: payload.description,
				owner: currentUser.get('oid')
			})

			const status = await pool.save()

			if (!status?._id)
				return new Rebuke('Pool could not be created.')

			return new Ok()
		} catch(err) {
			return new Rebuke('Error creating pool: ' + err?.message)
		}
	}

	// Get one pool
	async findOne(condition) {
		try {
			return await Pool.findOne(condition)
		} catch {
			return null
		}
	}
}


module.exports = new PoolService()