const compression = require('compression')
const config = require('../manager/config')

module.exports = {
	sync: () => config.getApp().use(compression())
}