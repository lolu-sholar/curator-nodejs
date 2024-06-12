const { cipher } = require('../../utils')
const { Ok, Rebuke } = require('../../utils/response')
const { User } = require('./model/user')

class ProfileService {
	constructor(){}

	// Get user by id
	async getUserById(id) {
		try {
			// Get user
			const user = await User.findById(id)

			return new Ok(user)
		} catch(err) {
			return new Rebuke('Error getting user by id: ' + err?.message)
		}
	}

	// Get user by email address
	async getUserByEmail(email) {
		try {
			// Get user
			const user = await User.findOne({
				email: cipher.encrypt(email)
			})

			return new Ok(user)
		} catch(err) {
			return new Rebuke('Error getting user by email: ' + err?.message)
		}
	}
}

module.exports = new ProfileService()