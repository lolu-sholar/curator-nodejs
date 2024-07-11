const cors = require('cors')
const config = require('../manager/config')

module.exports = {
	sync: () => config.getApp().use(cors())
}