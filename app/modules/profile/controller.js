const { cipher } = require('../../utils')
const { connection } = require('../../messaging/connection')

// Life is good message
const lifeIsGood = async(req, res) => {
	try {
		res.status(200).send('Life is good!')
	} catch {
		res.sendStatus(500)
	}
}

module.exports = {
	lifeIsGood
}