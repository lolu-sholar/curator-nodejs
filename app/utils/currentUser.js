const mongoose = require('mongoose')

let currentUser = null

module.exports = {
	set(user) {
		currentUser = user
	},
	get(key) {
		if (key)
			return ((key == 'oid' ? new mongoose.Types.ObjectId(currentUser['id']) : currentUser[key]) ?? null)
		else return currentUser
	}
}