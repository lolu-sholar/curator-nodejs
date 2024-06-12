const cloudinary = require('cloudinary').v2;
const config = require('../manager/config');

// Initialize
const init = () => {
	// Configuration
	cloudinary.config({ 
		cloud_name: config.env().CLOUDINARY_CLOUD_NAME, 
		api_key: config.env().CLOUDINARY_API_KEY, 
		api_secret: config.env().CLOUDINARY_API_SECRET,
		secure: true
	})
}

// Upload
const upload = async(data) => {
	try {
		// Init cloudinary
		init()

		// Place data into array, if not already
		data = Array.isArray(data) ? data : [data]

		// Define results array
		const results = []

		for (let image of data) {
			const result = await uploadOperation(image)
			if (result)
				results.push(result)
		}

		return results
	} catch(err) {
		console.log('Fatal error while uploading to cloudinary', err)
		return null
	}
}

// Upload operation
const uploadOperation = async(imageData, crop) => {
	try {
		const operationResult = {}

		// Upload an image
	  const uploadResult = await cloudinary.uploader.upload(imageData.data, {
	  	resource_type: 'auto',
	    public_id: imageData.id
	  })
	  .catch((error) => console.log('Error uploading image to cloudinary', error))
	  
	  operationResult['imageId'] = imageData.id
	  operationResult['url'] = uploadResult.secure_url
	  operationResult['format'] = uploadResult.format
	  
	  // Optimize delivery by resizing and applying auto-format and auto-quality
	  const optimizeUrl = cloudinary.url(imageData.id, {
	    fetch_format: 'auto',
	    quality: 'auto'
	  })
	  
	  operationResult['optimized'] = optimizeUrl
	  
	  // Check if to transform
	  if (crop) {
		  // Transform the image: auto-crop to square aspect_ratio
		  const autoCropUrl = cloudinary.url(imageData.id, {
		    crop: 'auto',
		    gravity: 'auto',
		    width: 500,
		    height: 500,
		  })

		  operationResult['cropped'] = uploadResult.autoCropUrl
		}

		return operationResult
	} catch {
		return null
	}
}

// Delete
const destroy = async(data) => {
	try {
		// Init cloudinary
		init()

		// Place data into array, if not already
		data = Array.isArray(data) ? data : [data]

		// Delete by public ids
		const deleteResult = await cloudinary.api.delete_resources(data)

		return deleteResult
	} catch(err) {
		console.log('Fatal error while deleting assets on cloudinary', err)
		return null
	}
}

module.exports = {
	upload,
	destroy
}