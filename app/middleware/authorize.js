const { cipher, jtoken, currentUser } = require('../utils')

// Verify claims
const isAuthValid = async(req, res, next, hard) => {
	let token = String(req.headers.authorization).split(' ')[1]
	let claims = await jtoken.verify(token)
	
	// Check if hard authorization
	if (hard) {
		if (!claims)
			return res.status(401).end('Unauthorized access.')
	}

	// Pass user object if valid
	if (claims)
		currentUser.set(cipher.encryptOrDecryptData(claims, true, ['iat', 'exp']))

	next()
}

class AuthorizationMiddleware {
	constructor(){}

	async easy(req, res, next) {
		await isAuthValid(req, res, next, false)
	}

	async hard(req, res, next) {
		await isAuthValid(req, res, next, true)
	}
}

module.exports = new AuthorizationMiddleware()