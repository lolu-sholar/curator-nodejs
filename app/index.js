const { config, middleware, router, db, agenda, server } = require('./manager')

// Load configuration
config.sync()
// Middleware
middleware.sync()
// Database
db.connect()
// Connect to agenda service
agenda.server.sync()
// Sync jobs
agenda.jobs.sync()
// Set app router
router.sync()
// Start server
server.run()