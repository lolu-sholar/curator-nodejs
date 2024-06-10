var rfs = require('rotating-file-stream')
var morgan = require('morgan')
var path = require('path')
const config = require('../manager/config')

module.exports = {
	sync() {
		if (config.env().STAGE == 'dev') {
			// Create a rotating write stream
			var accessLogStream = rfs.createStream('xapp-access.log', {
			  interval: '1d', // Rotate daily
			  path: path.join(__dirname, '../../log') // Log path
			})

			config.getApp().use(morgan('combined', {
				stream: accessLogStream,
				skip: function (req, res) { return res.statusCode < 400 } // Log only error responses
			}))
		}
	}
}