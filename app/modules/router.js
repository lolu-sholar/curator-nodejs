const routerAuth = require('./auth/router')
const routerCategory = require('./category/router')
const routerProfile = require('./profile/router')
const routerUtility = require('./utility/router')

exports.sync = () => {
	routerAuth.sync()
	routerCategory.sync()
	routerProfile.sync()
	routerUtility.sync()
}