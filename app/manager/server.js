const config = require('../manager/config')

exports.run = () => {
	const port = parseInt(process.env.PORT, 10),
				appName = String(process.env.APPNAME)
	// Listen on port
	config.getApp().listen(port, () => {
		console.log(`${appName} listening on ${port}`)
	})
}