const routerAuth = require('./auth/router')
const routerProfile = require('./profile/router')
const routerUtility = require('./utility/router')

exports.sync = () => {
	routerAuth.sync()
	routerProfile.sync()
	routerUtility.sync()
}