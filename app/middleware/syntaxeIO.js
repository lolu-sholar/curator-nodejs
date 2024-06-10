const SyntaxeIO = require('syntaxe-express')
const config = require('../manager/config')

module.exports = {
	sync() {
		// Add syntaxe middleware
		SyntaxeIO.init({
			enabled: true,
			app: config.getApp()
		})
	}
}