const helmet = require('helmet')
const config = require('../manager/config')

module.exports = {
	sync() {
		// Helmet
		if (process.env.STAGE=='prod')
			config.getApp().use(helmet())
	}
}