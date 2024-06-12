const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	userVerified: {
		type: Boolean,
		default: false
	},
	verificationCode: String,
	verificationToken: String,
	verificationExpiresIn: {
		type: Date,
		expires: 3600
	},
	passwordResetCode: String,
	passwordResetToken: String,
	passwordResetExpiresIn: {
		type: Date
	}
}, { timestamps: true })

exports.User = mongoose.model('user', UserSchema)