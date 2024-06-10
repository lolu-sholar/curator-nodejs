const Agenda = require('agenda')
const config = require('../manager/config')

// Define connection object
let agenda = null

// Connection
exports.sync = () => {
	agenda = new Agenda({ db: { address: config.env().MONGO_URI } })
	agenda.on('ready', () => console.log("[STATUS:AGENDA] Connected!"))
	agenda.on('error', () => console.log("[ERROR:AGENDA] Connection Error!"))
	agenda.start()
}

// Return connection object
exports.connection = () => {
	return agenda
}