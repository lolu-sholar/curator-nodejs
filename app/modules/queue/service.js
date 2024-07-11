const { cipher, jtoken, helpers, futureDate, env, cloudinary, currentUser } = require('../../utils')
const { Ok, Rebuke } = require('../../utils/response')
const { Queue } = require('./model')
const config = require('../../manager/config')
const authService = require('../auth/service')
const profileService = require('../profile/service')
const route = require('./route')
const { dispatcher, types } = require('../../messaging')

class QueueService {
	constructor(){}

	// Create queue
	async createQueue(payload) {
		try {
			// Get queue with name
			const queueDuplicate = await Queue.findOne({
				name: payload.name,
				owner: currentUser.get('oid')
			})

			// Check if exists
			if (queueDuplicate)
				return new Rebuke('You have an existing queue already with the same name.')

			// Create queue document
			const queue = new Queue({
				name: payload.name,
				description: payload.description,
				visible: payload.visible == 'true',
				owner: currentUser.get('oid')
			})

			const status = await queue.save()

			if (!status?._id)
				return new Rebuke('Queue could not be created.')

			return new Ok()
		} catch(err) {
			return new Rebuke('Error creating queue: ' + err?.message)
		}
	}

	// Create queue silently for user id
	async createQueueSilently(_id) {
		try {
			// Create queue document
			const queue = new Queue({
				name: 'General',
				description: 'General queue',
				general: true,
				owner: _id
			})

			const status = await queue.save()

			if (!status?._id)
				return new Rebuke('Queue could not be created.')

			return new Ok()
		} catch(err) {
			return new Rebuke('Error creating queue: ' + err?.message)
		}
	}

	// Get one queue
	async findOne(condition) {
		try {
			return await Queue.findOne(condition)
		} catch {
			return null
		}
	}
}


module.exports = new QueueService()