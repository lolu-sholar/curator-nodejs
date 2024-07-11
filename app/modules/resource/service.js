const { cipher, jtoken, helpers, futureDate, env, cloudinary, currentUser } = require('../../utils')
const { Ok, Rebuke } = require('../../utils/response')
const { Resource, ResourceProbe, ResourceLike, ResourceComment, ResourceCommentLike } = require('./model')
const config = require('../../manager/config')
const interestService = require('../interest/service')
const route = require('./route')
const cheerio = require('cheerio')
const { dispatcher, types } = require('../../messaging')
const { Worker } = require('worker_threads')
const { ProbeStatusType } = require('./types')
const path = require('path')
const url = require('url')

class ResourceService {
	constructor(){}

	// Get public resources for interest
	async getPublicResourcesForInterest(payload) {
		try {
			// Get list
			const list = await Resource.aggregate([
				{ $match: {
						public: { $eq: true },
						interestId: { $eq: payload.interestId }	
				} },
				{ $lookup: {
	          from: 'users',
	          localField: 'owner',
	          foreignField: '_id',
	          as: 'ownerInfo'
        } },
        { $lookup: {
	          from: 'interests',
	          localField: 'interestId',
	          foreignField: '_id',
	          as: 'interestInfo'
        } },
				{ $project: {
						title: 1,
						titleCustom: 1,
						description: 1,
						descriptionCustom: 1,
						photo: "$photo.optimized",
						interest: {
							_id: { $first: "$interestInfo._id" },
							title: { $first: "$interestInfo.title" }
						},
						owner: {
							$cond: {
								if: { $eq: [{ $size: "$ownerInfo" }, 0] },
									then: null,
								else: {
									_id: { $first: "$ownerInfo._id" },
									name: { $first: "$ownerInfo.name" }
								}
							}
						},
						isSystemOwned: '$system',
						createdAt: 1,
				} }
			])

			return new Ok(list)
		} catch(err) {
			return new Rebuke('Error getting resource list: ' + err?.message)
		}
	}

	// Verify and probe resource
	async verifyAndProbeResourceUrl(payload) {
		try {
			// Create probe id
			const probeId = helpers.uuid()

			// Save probe info to db
			const probe = new ResourceProbe({
				probeId,
				url: payload.url,
				status: ProbeStatusType.Pending,
				owner: currentUser.get('oid')
			})
			await probe.save()

			// Create new worker
			const worker = new Worker(path.join(path.dirname(path.dirname(__dirname)), 'workers', 'probe', 'probeResourceLite.js'))

			// Create new promise
			const promise = new Promise(resolve => {
				// Worker message and error handlers
				worker.on('message', async message => {
					// Log response to stdout
					console.log('[STATUS:TASK_PROBE] Probe request completed.')
					console.log('[MESSAGE:PROBE]', message)

					probe.title = message.title
					probe.description = message.description || message.title
					probe.coverImage = message.coverPhoto
					probe.processedImage = message.processedPhoto
					probe.platform = message.platform
					probe.status = ProbeStatusType.Success
					await probe.save()

					// Check if waiting for response
					if (payload.wait == 'true') {
						resolve(new Ok({
							message: 'Probe task done.',
							data: message
						}))
					}
				})
				worker.on('error', async error => {
					// Log error
					console.error('[STATUS:TASK_PROBE] Probe request failed:', error)

					// Save probe info to db
					probe.status = ProbeStatusType.Failed
					await probe.save()

					// Check if waiting for response
					if (payload.wait == 'true')
						resolve(new Rebuke('Probe operation failed.'))
				})

				// Exit event
				worker.on('exit', code => {
					console.error('[STATUS:TASK_PROBE] Worker exited with code %s', code)

					// Check if waiting for response
					if (payload.wait == 'true')
						resolve(new Rebuke('Probe operation failed and exited.'))
				})
			})

			// Pass data to worker
			worker.postMessage({
				url: payload.url,
				creds: config.env(),
				wait: payload.wait,
				probeId
			})
			
			// Check if wait for response or not
			if (payload.wait != 'true') {
				return new Ok({
					message: 'Probe task started.',
					data: {
						probeId
					}
				})
			} else {
				return await promise
			}
		} catch(err) {
			return new Rebuke('Error probing resource: ' + err?.message)
		}
	}

	// Get probe status
	async getResourceProbeStatus(payload) {
		try {
			// Get document
			const probe = await ResourceProbe.findOne({
				probeId: payload.probeId
			})

			// Check if valid
			if (!probe)
				return new Rebuke('Probe with id does not exist.')

			return new Ok(probe)
		} catch(err) {
			return new Rebuke('Error getting probe status: ' + err?.message)
		}
	}

	// Create resource
	async createResource(payload) {
		try {
			// Get document
			const probe = await ResourceProbe.findOne({
				probeId: payload.probeId
			})

			// Check if valid
			if (!probe)
				return new Rebuke('Probe with id does not exist.')

			// Create resource
			const resource = new Resource({
				title: probe.title || payload.title,
				titleCustom: payload.title || probe.title,
				description: probe.description || payload.description,
				descriptionCustom: payload.description || probe.description,
				resourceOrigin: probe.url,
				resourceOriginHost: url.parse(probe.url).hostname,
				resourceOriginPlatform: probe.platform,
				actualCoverImageUrl: probe.coverImage,
				public: payload.public == 'true',
				probeId: helpers.makeObjectId(payload.probeId),
				interestId: helpers.makeObjectId(payload.interestId),
				owner: currentUser.get('oid')
			})

			// Process the image for the resource
			if (payload.coverImageData) {
				// Decorate photo to upload
				const photos = [{ 
					id: 'mr1_' + helpers.uuidClean(),
					data: payload.coverImageData,
					folder: config.env().CLOUDINARY_FOLDER_RESOURCE
				}]

				// Upload photos
				const uploadedPhotos = await cloudinary.upload(photos)

				// Check if image uploaded successfully
				if (!uploadedPhotos || !uploadedPhotos.length)
					return new Rebuke('[MR100] Error while creating resource.')

				// Update photo and save
				resource.photo = uploadedPhotos[0]
			} else resource.photo = probe.processedImage

			// Save resource
			await resource.save()

			return new Ok({
				_id: resource._id,
				title: resource.title,
				titleCustom: resource.titleCustom,
				description: resource.description,
				descriptionCustom: resource.descriptionCustom,
				platform: resource.resourceOriginPlatform,
				photo: resource.photo,
				createdAt: resource.createdAt
			})
		} catch(err) {
			return new Rebuke('Error creating resource: ' + err?.message)
		}
	}

	// Like/unlike a resource
	async likeResource(payload) {
		try {
			// Get document
			const resource = await Resource.findOne({
				resourceId: payload.resourceId
			})

			// Check if valid
			if (!resource)
				return new Rebuke('Resource with id does not exist.')

			// Define common query
			const query = {
				resourceId: helpers.makeObjectId(payload.resourceId),
				likedBy: currentUser.get('oid')
			}

			// Check reaction
			if (helpers.isTrue(payload.like)) {
				// Create resource like and save
				const resourceLike = new ResourceLike(query)
				resourceLike.save()
			} else {
				// Delete like
				ResourceLike.deleteOne(query)
			}

			return new Ok()
		} catch(err) {
			return new Rebuke('Error reacting to resource: ' + err?.message)
		}
	}

	// Get comments for resource
	async getComments(payload) {
		try {
			// Get list
			const list = await ResourceComment.aggregate([
				{ $match: {
						resourceId: { $eq: payload.resourceId },
						parentCommentId: { $eq: null }
				} },
				{ $lookup: {
	          from: 'users',
	          localField: 'commentBy',
	          foreignField: '_id',
	          as: 'commenterInfo'
        } },
				{ $lookup: {
	          from: 'resourceCommentLikes',
	          localField: '_id',
	          foreignField: 'commentId',
	          as: 'commentLikes'
        } },
				{ $lookup: {
	          from: 'resourceComments',
	          localField: '_id',
	          foreignField: 'parentCommentId',
	          as: 'commentChildren'
        } },
				{ $project: {
						comment: 1,
						edited: 1,
						commenter: {
							$cond: {
								if: { $eq: [{ $size: "$commenterInfo" }, 0] },
									then: null,
								else: {
									_id: { $first: "$commenterInfo._id" },
									name: { $first: "$commenterInfo.name" }
								}
							}
						},
						likes: { $size: '$commentLikes' },
						hasComments: { $gt: [{ $size: '$commentChildren' }, 0] },
						createdAt: 1
				} }
			])

			return new Ok(list)
		} catch(err) {
			return new Rebuke('Error getting resource comments: ' + err?.message)
		}
	}

	// Get comments for comment
	async getCommentChildren(payload) {
		try {
			// Get list
			const list = await ResourceComment.aggregate([
				{ $match: {
						parentCommentId: { $eq: payload.commentId }
				} },
				{ $lookup: {
	          from: 'users',
	          localField: 'commentBy',
	          foreignField: '_id',
	          as: 'commenterInfo'
        } },
				{ $lookup: {
	          from: 'resourceCommentLikes',
	          localField: '_id',
	          foreignField: 'commentId',
	          as: 'commentLikes'
        } },
				{ $lookup: {
	          from: 'resourceComments',
	          localField: '_id',
	          foreignField: 'parentCommentId',
	          as: 'commentChildren'
        } },
				{ $project: {
						_id: 1,
						comment: 1,
						edited: 1,
						commenter: {
							$cond: {
								if: { $eq: [{ $size: "$commenterInfo" }, 0] },
									then: null,
								else: {
									_id: { $first: "$commenterInfo._id" },
									name: { $first: "$commenterInfo.name" }
								}
							}
						},
						likes: { $size: '$commentLikes' },
						hasComments: { $gt: [{ $size: '$commentChildren' }, 0] },
						createdAt: 1
				} }
			])

			return new Ok(list)
		} catch(err) {
			return new Rebuke('Error getting comments for comment: ' + err?.message)
		}
	}

	// Comment on resource/resource comment
	async makeComment(payload) {
		try {
			// Get document
			const resource = await Resource.findOne({
				resourceId: payload.resourceId
			})
			// Define possible comment
			let comment = null

			// Check if valid
			if (!resource)
				return new Rebuke('Resource with id does not exist.')

			// Check if comment is for comment
			if (payload.commentId) {
				comment = await ResourceComment.findOne({
					resourceId: payload.resourceId,
					parentCommentId: payload.commentId	
				})
			}

			// Create comment
			const newComment = new ResourceComment({
				resourceId: helpers.makeObjectId(payload.resourceId),
				parentCommentId: comment?._id || null,
				comment: payload.comment,
				commentBy: currentUser.get('oid')
			})
			newComment.save()

			return new Ok(newComment)
		} catch(err) {
			return new Rebuke('Error creating comment: ' + err?.message)
		}
	}

	// Update comment
	async updateComment(payload) {
		try {
			// Get document
			const comment = await ResourceComment.findById(payload.commentId)

			// Check if valid
			if (!comment)
				return new Rebuke('Comment with id does not exist.')

			// Update comment
			comment.comment = payload.comment
			comment.edited = true
			comment.save()

			return new Ok(comment)
		} catch(err) {
			return new Rebuke('Error updating comment: ' + err?.message)
		}
	}

	// Like/unlike a comment
	async likeComment(payload) {
		try {
			// Get document
			const comment = await ResourceComment.findById(payload.commentId)

			// Check if valid
			if (!comment)
				return new Rebuke('Comment with id does not exist.')

			// Define common query
			const query = {
				commentId: helpers.makeObjectId(payload.commentId),
				likedBy: currentUser.get('oid')
			}

			// Check reaction
			if (helpers.isTrue(payload.like)) {
				// Create comment like and save
				const commentLike = new ResourceCommentLike(query)
				commentLike.save()
			} else {
				// Delete like
				ResourceCommentLike.deleteOne(query)
			}

			return new Ok()
		} catch(err) {
			return new Rebuke('Error reacting to comment: ' + err?.message)
		}
	}

	// Delete a comment
	async deleteComment(payload) {
		try {
			// Get document
			const comment = await ResourceComment.findById(payload.commentId)

			// Check if valid
			if (!comment)
				return new Rebuke('Comment with id does not exist.')

			// Delete like
			ResourceComment.deleteOne({
				_id: comment._id
			})

			return new Ok()
		} catch(err) {
			return new Rebuke('Error deleting comment: ' + err?.message)
		}
	}
}


module.exports = new ResourceService()