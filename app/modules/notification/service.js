const mailer = require('../../utils/mailer')
const { Ok, Rebuke } = require('../../utils/response')

class NotificationService {
	constructor(){}

	// Send mail
	async sendMail(payload) {
		try {
			// Send mail
			await mailer.send({
				to: [payload.email.to],
				message: `<div>${payload.email.message}</div>`,
				subject: payload.email.subject
			})
		} catch(err) {
			return new Rebuke('Error while sending mail.')
		}
	}
}

module.exports = new NotificationService()