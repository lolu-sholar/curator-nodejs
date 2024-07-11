const { cipher, jtoken, helpers, futureDate, env, cloudinary, currentUser } = require('../../utils')
const { Ok, Rebuke } = require('../../utils/response')
const { Collection, CollectionFollower, CollectionInvitation } = require('./model')
const config = require('../../manager/config')
const authService = require('../auth/service')
const profileService = require('../profile/service')
const interestService = require('../interest/service')
const route = require('./route')
const { dispatcher, types } = require('../../messaging')

class CollectionService {
	constructor(){}

	// Get public collections list
	async getPublicCollectionsList(payload) {
		try {
			// Get list
			const list = await Collection.aggregate([
				{ $match: {
						public: { $eq: true },
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
        { $lookup: {
	          from: 'collectionFollowers',
	          localField: '_id',
	          foreignField: 'collectionId',
	          as: 'colFollowers'
        } },
				{ $project: {
						title: 1,
						description: 1,
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
						noFollowers: { $size: '$colFollowers' },
						isSystemOwned: '$system',
						createdAt: 1,
				} }
			])

			return new Ok(list)
		} catch(err) {
			return new Rebuke('Error getting collection list: ' + err?.message)
		}
	}

	// Get public collection list for interest
	async getPublicCollectionForInterest(payload) {
		try {
			// Get list
			const list = await Collection.aggregate([
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
        { $lookup: {
	          from: 'collectionFollowers',
	          localField: '_id',
	          foreignField: 'collectionId',
	          as: 'colFollowers'
        } },
				{ $project: {
						title: 1,
						description: 1,
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
						noFollowers: { $size: '$colFollowers' },
						isSystemOwned: '$system',
						createdAt: 1,
				} }
			])

			return new Ok(list)
		} catch(err) {
			return new Rebuke('Error getting collection list: ' + err?.message)
		}
	}

	// Create collection
	async createCollection(payload) {
		try {
			// Get collection with title
			const collectionDuplicate = await Collection.findOne({
				title: payload.title
			})

			// Check if collection is public
			if (payload.public == 'true') {
				if (collectionDuplicate && collectionDuplicate.public && (collectionDuplicate.categoryId == payload.interestId))
					return new Rebuke('A public collection already exists for the interest with the same title.')
			} else {
				if (collectionDuplicate && currentUser.isUser(collectionDuplicate.owner) && (collectionDuplicate.interestId == payload.interestId))
					return new Rebuke('You have an existing private collection for the interest with the same title.')
			}

			// Get and check interest
			const interest = await interestService.findOne({
				_id: payload.interestId
			})
			if (!category)
				return new Rebuke('The category is not valid.')

			// Create collection document
			const collection = new Collection({
				title: payload.title,
				description: payload.description,
				public: payload.public == 'true',
				interestId: payload.interestId,
				owner: currentUser.get('oid')
			})

			// Decorate photo to upload
			const photos = [{ 
				id: 'col1_' + helpers.uuidClean(),
				data: payload.photo,
				folder: config.env().CLOUDINARY_FOLDER_CAT_INT
			}]

			// Upload photos
			const uploadedPhotos = await cloudinary.upload(photos)

			// Check if image uploaded successfully
			if (!uploadedPhotos || !uploadedPhotos.length)
				return new Rebuke('[MCOL100] Error while creating collection.')

			// Update photo and save
			interest.photo = uploadedPhotos[0]
			const status = await interest.save()

			if (!status?._id)
				return new Rebuke('Collection could not be created.')

			return new Ok()
		} catch(err) {
			return new Rebuke('Error creating collection: ' + err?.message)
		}
	}

	// Follow collection
	async followCollection(payload) {
		try {
			// Define queries
			const collectionQuery = { collectionId: helpers.makeObjectId(payload.collectionId) }
			const mainQuery = {
				followerId: currentUser.get('oid'),
				...collectionQuery
			}

			// Get and check collection
			const collection = await Collection.findById(payload.collectionId)
			if (!collection)
				return new Rebuke('Collection is invalid.')

			// Get relationship
			const relationship = await CollectionFollower.findOne(mainQuery)

			// Check action
			const follow = (payload.follow == 'true')

			// If action is to follow
			if (follow) {
				if (relationship)
					return new Rebuke('User already follows collection.')

				// Create and save relationship
				const follower = new CollectionFollower(mainQuery)
				const status = await follower.save()

				// Check if saved
				if (!status?._id)
					return new Rebuke('User could not be linked to collection.')
			} else {
				if (!relationship)
					return new Rebuke('User does not follow collection.')

				// Delete relationship
				const status = await CollectionFollower.deleteOne(mainQuery)
				if (!status?.deletedCount)
					return new Rebuke('User could not be unlinked from collection.')				
			}

			return new Ok()
		} catch(err) {
			return new Rebuke('Error following collection: ' + err?.message)
		}
	}	

	// Invite to follow
	async inviteToFollow(payload) {
		try {
			// Get and check user
			const user = await profileService.getUserByEmail(payload.email)
			
			// Define queries
			const collectionQuery = { collectionId: helpers.makeObjectId(payload.collectionId) }
			const mainQuery = {
				followerId: user.data?._id ?? '',
				...collectionQuery
			}

			// Get and check collection
			const collection = await Collection.findById(payload.collectionId)
			if (!collection)
				return new Rebuke('Collection is invalid.')

			// Get and check inviter
			const inviter = await profileService.getUserById(currentUser.get('id'))
			if (inviter.data.email == user.data?.email)
				return new Rebuke("C'mon! You can't invite yourself.")

			// Check if user exists on platform
			if (user.data && !user.error) {
				// Get and check relationship
				const relationship = await CollectionFollower.findOne(mainQuery)
				if (relationship)
					return new Rebuke('User already follows collection.')
			}

			// Define invitation data
			const invitationData = {
				interestId: collectionQuery.collectionId,
				inviterId: inviter.data._id,
				inviteeEmail: cipher.encrypt(payload.email)
			}

			// Delete all previous invitations exists
			await CollectionInvitation.deleteMany(invitationData)

			// Create new invitation
			const newInvitation = new CollectionInvitation(invitationData)
			newInvitation.isInviteeKnown = Boolean(user.data?._id)
			await newInvitation.save()

			// Check if success
			if (!newInvitation?._id)
				return new Rebuke('Invitation could not be sent.')

			// Define intitation link data
			const encryptedInviteLink = jtoken.create(cipher.encryptOrDecryptData({
				ivId: String(newInvitation._id),
				validInvitation: true
			}), '30d') 
			const acceptInvitationUrl = config.env().APP_URL 
				+ route.group 
				+ route.processInvite 
				+ `?iv=` + encryptedInviteLink

			// Notification service
			dispatcher.announce([
				{
					type: types.NotificationType.Email,
					email: {
						to: cipher.decrypt(inviter.data.email),
						message: `You just invited '${payload.email}' to follow collection '${collection.title}'.`,
						subject: 'Collection Invite'
					}
				},
				{
					type: types.NotificationType.Email,
					email: {
						to: payload.email,
						message: `${inviter.data.name} has invited you to follow collection '${collection.title}'. Click on the link below to accept invitation.
						<br/>
						<br/>
						<a href="${acceptInvitationUrl}">${acceptInvitationUrl}</a>`,
						subject: 'Collection Invite'
					}
				}
			])

			return new Ok()
		} catch(err) {
			return new Rebuke('Error inviting user to follow collection: ' + err?.message)
		}
	}

	// Process invitation
	async processInvitation(payload) {
		try {
			// Validate iv
			const iv = await jtoken.verify(payload?.iv)
			const ivData = cipher.encryptOrDecryptData(iv, true, ['iat','exp'])
			if (!iv || !ivData || (ivData && ivData?.validInvitation != 'true'))
				return new Rebuke({ code: 1, message: 'Invitation is invalid.' })

			// Check invitation
			const invitation = await CollectionInvitation.findById(ivData.ivId)
			if (!invitation || (invitation && invitation.inviteAccepted))
				return new Rebuke({ code: 1, message: 'Invitation is no longer valid.' })

			// Get and check collection
			const collection = await Collection.findById(invitation.interestId)
			if (!collection)
				return new Rebuke({ code: 2, message: 'Collection is no longer valid.' })

			// Get and check user
			let user = (await profileService.getUserByEmail(cipher.decrypt(invitation.inviteeEmail))).data

			// Check if this is an iv inquiry
			if (!payload?.authByInvitation) {
				// Check if there's a user signed in
				if (currentUser.get('id')) {
					// Check if signed in user is invitee
					if (currentUser.get('email') == cipher.decrypt(invitation.inviteeEmail)) {
						// Accept invitation
						return await this.acceptAndSettleInvite(invitation, user, collection)
					} else return new Rebuke({ code: 6, message: 'Signed in user is not the invitee.' })
				} else {
					if (user)
						return new Rebuke({ code: 7, message: 'User must sign in to accept invite.' })
					else {
						return new Rebuke({
							code: 5,
							message: 'Invitee does not exist. User should provide necessary details to create new account.',
							data: {
								collection: collection.title,
								user: cipher.decrypt(invitation.inviteeEmail),
								iv: payload?.iv
							}
						})
					}
				}
			} 
			// Check if potential user has provided details for a new account
			else {
				// Check if user exists
				if (user) {
					if (currentUser.get('id')) {
						if (currentUser.get('email') == cipher.decrypt(invitation.inviteeEmail)) {
							// Accept invitation
							return await this.acceptAndSettleInvite(invitation, user, collection)
						} else return new Rebuke({ code: 6, message: 'Signed in user is not the invitee.' })
					} else return new Rebuke({ code: 7, message: 'User must sign in to accept invite.' })
				} else {
					// Create new user
					user = await authService.registerByInvitation({
						email: cipher.decrypt(invitation.inviteeEmail),
						name: payload.name,
						password: payload.password
					})

					// Check for error
					if (user.error)
						return new Rebuke({ code: 8, message: 'An error occurred when creating new user account.' })

					// Accept invitation
					const opStatus = await this.acceptAndSettleInvite(invitation, user.data.account, collection)
					if (opStatus.error)
						return opStatus

					return new Ok({
						message: 'Invitation successfully accepted.',
						data: user.data.login
					})
				}
			}
		} catch(err) {
			return new Rebuke('Error processing collection invitation: ' + err?.message)
		}
	}

	// Accept invitation
	async acceptAndSettleInvite(invitation, user, collection) {
		try {
			// Accept invitation and save
			invitation.inviteAccepted = true
			invitation.save()

			// Define queries
			const collectionQuery = { interestId: helpers.makeObjectId(invitation.collectionId) }
			const mainQuery = {
				followerId: helpers.makeObjectId(user._id),
				...collectionQuery
			}

			// Get and check relationship
			const relationship = await CollectionFollower.findOne(mainQuery)
			if (relationship)
				return new Rebuke({ code: 3, message: 'User already follows collection.' })

			// Create and save relationship
			const follower = new CollectionFollower(mainQuery)
			const status = await follower.save()

			// Check if saved
			if (!status?._id)
				return new Rebuke({ code: 4, message: 'User could not be linked to collection.' })

			// Get and check inviter
			const inviter = await profileService.getUserById(String(invitation.inviterId))
			
			// Notification service
			dispatcher.announce([
				{
					type: types.NotificationType.Email,
					email: {
						to: cipher.decrypt(inviter.data.email),
						message: `${user.name} has accepted your invitation to follow collection '${collection.title}'.`,
						subject: 'Invitation Accepted'
					}
				},
				{
					type: types.NotificationType.Email,
					email: {
						to: cipher.decrypt(user.email),
						message: `You accepted the invitation from '${inviter.data.name}', and now you're following collection '${collection.title}'.`,
						subject: `Collection '${interest.title}' Followed`
					}
				}
			])

			return new Ok('Invitation successfully accepted.')
		} catch(err){
			return new Rebuke()
		}
	}

	// Get one collection
	async findOne(condition) {
		try {
			return await Collection.findOne(condition)
		} catch {
			return null
		}
	}
}


module.exports = new CollectionService()