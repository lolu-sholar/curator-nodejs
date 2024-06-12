const mailer = require('../../utils/mailer')

class NotificationService {
	constructor(){}

	// Send mail
	async sendMail(payload) {
		try {
			// Send mail
			const status = await mailer.send({
				to: [payload.email.to],
				message: `<div>${payload.email.message}</div>`,
				subject: payload.email.subject
			})
			
			console.log('Mail status:', status)
		} catch(err) {
			console.error('Error sending mail:', err)
			return new Rebuke('Error while sending mail.')
		}
	}
}

module.exports = new NotificationService()