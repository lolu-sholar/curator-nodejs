const { cipher } = require('../../utils')
const { Worker } = require('worker_threads')
const path = require('path')
const config = require('../../manager/config')

class UtilityService {
	constructor(){}

	// Show hello message
	async hello(req, res) {
		res.json({ message: `Hello World! ${new Date()}` })
	}

	// Encrypt/decrypt payload
	async transformPayload(req, res) {
		try {
			const payload = req.body
			const decrypt = req.query.hasOwnProperty('decrypt')

			const value = cipher.encryptOrDecryptData(payload, decrypt)

			res.json({
				data: value ?? '{}'
			})
		} catch(err) {
			res.status(400).send(err.toString())
		}
	}

	// Create seedable categories
	async createSeedableCategories(req, res) {
		try {
			if (!config.env().RAW_BUILD_DATA_STATUS) {
				const worker = new Worker(path.join(path.dirname(path.dirname(__dirname)), 'workers', 'buildCategories.js'))
				const rawCategoriesData = require('./data/category/raw')

				// Worker message and error handlers
				worker.on('message', console.log)
				worker.on('error', error => console.error)

				// Exit event
				worker.on('exit', code => {
					if (code !== 0)
						console.error('Worker encountered an error with code %s', code)
					else console.log('Worker exited with code %s', code)
				})

				// Pass data to worker
				worker.postMessage({
					data: rawCategoriesData,
					creds: config.env()
				})

				return res.json({
					status: 'Category build task started'
				})
			}

			res.json({
				status: 'Category data already built'
			})
		} catch(err) {
			res.status(400).send(err.toString())
		}
	}
}

module.exports = new UtilityService()