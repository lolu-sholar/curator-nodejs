class ServiceResponse {
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

		if (!this.error) {
			delete this.error
			delete this.code
		}

		delete this.ok
		delete this.bad
	}
}

class Rebuke extends ServiceResponse {
	constructor(error = 'error', code) {
		super({ error, code })
	}
}

class Ok extends ServiceResponse {
	constructor(options) {
		super(!['string', 'undefined'].includes(typeof options)
			? (Array.isArray(options) 
				? { data: options } 
				: (options.hasOwnProperty('data') || options.hasOwnProperty('message'))
					? { ...options } 
					: { data: options }) 
			: { message: options })
	}
}

module.exports = { Ok, Rebuke }