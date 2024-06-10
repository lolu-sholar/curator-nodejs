const { Resend } = require('resend')
const { helpers } = require('./index')
const config = require('../manager/config')

// Email sender
module.exports = {
	// Use resend mail client
	async send (options) {
		try {
			// Create resend object
			const resend = new Resend(config.env().RESEND_API_KEY)

			// Send mail
			const { data, error } = await resend.emails.send({
			  from: options?.from 
			  	? `${options?.fromName} <${options?.from}>` 
			  	: `${config.env().MAIL_FROM_NAME} <${config.env().MAIL_FROM_ADDRESS}>`,
			  to: options?.to,
			  subject: options?.subject,
			  html: options?.message,
			  headers: { 'X-Entity-Ref-ID': helpers.uuid() },
			})

			// Check for error
			if (error) {
				console.error('[RESEND_MAILERROR]: ', error)
				return false	
			}

			return true
		} catch(err) {
			console.error('[RESEND_MAILERROR]: ', err)
			return false
		}
	}
}