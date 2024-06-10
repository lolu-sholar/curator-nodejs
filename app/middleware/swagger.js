const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const config = require('../manager/config')

module.exports = {
	sync() {
		const options = {
			definition: {
				openapi: '3.1.0',
				info: {
					title: `${config.env().APPNAME} API`,
					description: `API endpoints for ${String(config.env().APPNAME).toLowerCase()} content curation platform`,
					version: '1.0.0'
				},
				servers: [
					{
						url: 'http://localhost:9000/',
						description: 'Local development server'
					},
					{
						url: config.env().LIVE_DOCS_URL,
						description: 'Production server'
					}
				],
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT'
						}
					}
				},
				security: [
					{
						bearerAuth: []
					}
				]
			},
			apis: ['./app/modules/**/docs/**/*.js']
		}

		const swaggerSpec = swaggerJsDoc(options)

		// Swagger page
		config.getApp().use('/swagger', (req, res, next) => {
		    swaggerSpec.host = req.get('host')
		    req.swaggerDoc = swaggerSpec
		    next()
		}, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
			swaggerOptions: {
				docExpansion: 'none'
			}
		}))

		// JSON documentation
		config.getApp().get('/swagger.json', (req, res) => {
			res.setHeader('Content-Type', 'application/json')
			res.send(swaggerSpec)
		})
	}
}