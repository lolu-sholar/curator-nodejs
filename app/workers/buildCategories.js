const fs = require('fs')
const path = require('path')
const { parentPort } = require('worker_threads')
const { cloudinary, helpers } = require('../utils')

// Receive message from parent
parentPort.on('message', async message => {
	const categories = message.data
	const creds = message.creds
	let taskCounter = 1,
			subTaskCounter = 1

	// Loop trhough categories
	for (let cat of categories) {
		// Doenaload image and upload to cloudinary
		let imageData = await downloadAndUploadImageData(cat.image.url, creds)
		
		taskCounter++

		// Add id
		cat['_id'] = helpers.makeObjectId()
		// Adjust category image object
		cat.image = {
			...imageData,
			author: cat.image.author,
			authorUrl: cat.image.authorUrl
		}

		// Loop through category interests
		for (let catInt of cat.interests) {
			// Download and upload image to cloudinary
			imageData = await downloadAndUploadImageData(catInt.image.url, creds)

			subTaskCounter++

			// Add id
			catInt['_id'] = helpers.makeObjectId()
			catInt['categoryId'] = cat._id
			// Adjust image object
			catInt.image = {
				...imageData,
				author: catInt.image.author,
				authorUrl: catInt.image.authorUrl
			}

			console.log(`[COMPLETE] ${cat.title} > ${catInt.title}`)
		}

		console.log(`[COMPLETE] ${cat.title}`)
	}

	// Define destination path
	const destPath = path.join(path.dirname(__dirname), 'modules', 'utility', 'data', 'category', 'seed.js')
	// Create write stream
	const writeStream = fs.createWriteStream(destPath)
	writeStream.write(JSON.stringify(categories, null, 2))
	writeStream.on('finish', _ => {
		// Pass message to parent
		parentPort.postMessage({
			success: true,
			status: `Tasks completed for ${taskCounter} categories and ${subTaskCounter} category interests.`
		})
		// Close stream
		writeStream.end()
	})
})

// Downaload image
const downloadAndUploadImageData = (imageUrl, creds) => {
	return new Promise(resolve => {
		fetch(imageUrl)
			.then(response => response.blob())
			.then(blob => {
				return new Promise(resolve => {
					blob.arrayBuffer()
						.then(arrayBuffer => {
							const bytes = new Uint8Array(arrayBuffer)
					    let binary = ''
					    for (let i = 0; i < bytes.length; i++) {
					        binary += String.fromCharCode(bytes[i])
					    }

					    resolve(`data:${blob.type};base64,${btoa(binary)}`)
						})
				})
			})
			.then(async dataUri => {
				// Decorate photo to upload
				const photos = [{ id: 'x2_' + helpers.uuidClean(), data: dataUri, folder: creds.CLOUDINARY_FOLDER_CAT_INT }]
				// Upload photos
				const uploadedPhotos = await cloudinary.upload(photos, creds)
				resolve(uploadedPhotos[0])
			})
	})
}