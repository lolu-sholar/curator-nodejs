const expressJson = require('./expressJson')
const cors = require('./cors')
const compression = require('./compression')
const morgan = require('./morgan')
const helmet = require('./helmet')
const syntaxeIO = require('./syntaxeIO')
const swagger = require('./swagger')
const paginator = require('./paginator')
const config = require('../manager/config')

exports.sync = () => {
	// Add middlewares
	expressJson.sync()
	cors.sync()
	compression.sync()
	morgan.sync()
	helmet.sync()
	paginator.sync()
	syntaxeIO.sync()
	swagger.sync()

	// Disable header
	config.getApp().disable('x-powered-by')
}