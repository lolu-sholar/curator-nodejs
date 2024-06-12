// Base response
class BaseResponse {
	ok = 200
	bad = 400
	code
	message
	error
	data

	constructor(options) {
		this.code = options?.code || (options?.error ? this.bad : this.ok)
		this.message = options?.message || options?.error || 'Success'
		this.error = Boolean(options?.error)
		this.data = options?.data

		// If there's no error, omit the error field. 
		// Omit the data field if there's an error
		if (!this.error)
			delete this.error
		else delete this.data

		// Omit the ok and bad fields
		delete this.ok
		delete this.bad
	}
}

// Error response
class Rebuke extends BaseResponse {
	constructor(error = 'Error', code) {
		super({ error, code })
	}
}

// Success response
class Ok extends BaseResponse {
	constructor(options) {
		let config

		if (!['string', 'undefined'].includes(typeof options)) {
			if (Array.isArray(options))
				config = { data: options }
			else if (options.hasOwnProperty('data') || options.hasOwnProperty('message') || options.hasOwnProperty('code')) {
				config = { ...options }
			} else config = { data: options } 
		} else config = { message: options }

		super(config)
	}
}

module.exports = { Ok, Rebuke }