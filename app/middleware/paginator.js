const url = require('url')
const config = require('../manager/config')

// Define paginator object
const pageInfo = {
	no: null,
	limit: null,
	requestUrl: null,
	requestId: null,
	active: false
}

const callback = async(req, res, next) => {
	try {
	  // Get query parameters
	  [pageInfo.no, pageInfo.limit] = [Number(req.query?.pageNumber), Number(req.query?.pageLimit)]
	  // Check if active
	  pageInfo.active = pageInfo.no > 0 && pageInfo.limit > 0
	  // Get request url
	  pageInfo.requestUrl = url.parse(req.url, true)
	  // Get request id
	  pageInfo.requestId = String(pageInfo.requestUrl.pathname.substr(1)).replace(/[^\w]+/g, '-')

	  // Check if paginator is active
	  if (pageInfo.active) {
		  // Grab object send function
		  const originalSend = res.send
		  // Hook to new send function
		  res.send = function (response) {
		  	// Get response data
		  	let responseObject = JSON.parse(response),
		  			dataObject = responseObject?.data ?? responseObject

		  	// Check if array
		  	if (Array.isArray(dataObject)) {
		  		// Define start and end
		  		const start = (pageInfo.no * pageInfo.limit) - pageInfo.limit,
		  				end = start + pageInfo.limit

		  		// Adjust response result
		  		const finalForm = {
		  			...responseObject,
		  			data: dataObject.slice(start, end),
		  			pages: Math.ceil(dataObject.length / pageInfo.limit)
		  		}

		  		// Stringify response
		  		response = JSON.stringify(finalForm)
		  	}
		  	
		  	originalSend.call(res, response)
		  }
		}
	} catch(err) {
		console.error('Error setting up paginator', err)
	}

	next()
}

module.exports = {
	sync() {
		config.getApp().use(callback)
  }
}