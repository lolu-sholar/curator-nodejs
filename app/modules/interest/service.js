const { cipher, jtoken, helpers, futureDate, env, cloudinary, currentUser } = require('../../utils')
const { Ok, Rebuke } = require('../../utils/response')
const { Interest, InterestFollower, InterestInvitation } = require('./model')
const config = require('../../manager/config')
const authService = require('../auth/service')
const profileService = require('../profile/service')
const categoryService = require('../category/service')
const route = require('./route')
const { dispatcher, types } = require('../../messaging')

class InterestService {
	constructor(){}

	// Get public interests list
	async getPublicInterestsList(payload) {
		try {
			// Get list
			const list = await Interest.aggregate([
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
	          from: 'categories',
	          localField: 'categoryId',
	          foreignField: '_id',
	          as: 'categoryInfo'
        } },
				{ $lookup: {
	          from: 'resources',
	          localField: '_id',
	          foreignField: 'interestId',
	          as: 'intResources'
        } },
        { $lookup: {
	          from: 'interestFollowers',
	          localField: '_id',
	          foreignField: 'interestId',
	          as: 'intFollowers'
        } },
				{ $project: {
						title: 1,
						description: 1,
						photo: "$photo.url",
						category: {
							_id: { $first: "$categoryInfo._id" },
							title: { $first: "$categoryInfo.title" }
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
						noResources: { $size: '$intResources' },
						noFollowers: { $size: '$intFollowers' },
						isSystemOwned: '$system',
						createdAt: 1,
				} }
			])

			return new Ok(list)
		} catch(err) {
			return new Rebuke('Error getting interest list: ' + err?.message)
		}
	}

	// Get public interest list for category
	async getPublicInterestsForCategory(payload) {
		try {
			// Get list
			const list = await Interest.aggregate([
				{ $match: {
						public: { $eq: true },
						categoryId: { $eq: payload.categoryId }	
				} },
				{ $lookup: {
	          from: 'users',
	          localField: 'owner',
	          foreignField: '_id',
	          as: 'ownerInfo'
        } },
        { $lookup: {
	          from: 'categories',
	          localField: 'categoryId',
	          foreignField: '_id',
	          as: 'categoryInfo'
        } },
        { $lookup: {
	          from: 'resources',
	          localField: '_id',
	          foreignField: 'interestId',
	          as: 'intResources'
        } },
        { $lookup: {
	          from: 'interestFollowers',
	          localField: '_id',
	          foreignField: 'interestId',
	          as: 'intFollowers'
        } },
				{ $project: {
						title: 1,
						description: 1,
						photo: "$photo.url",
						category: {
							_id: { $first: "$categoryInfo._id" },
							title: { $first: "$categoryInfo.title" }
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
						noResources: { $size: '$intResources' },
						noFollowers: { $size: '$intFollowers' },
						isSystemOwned: '$system',
						createdAt: 1,
				} }
			])

			return new Ok(list)
		} catch(err) {
			return new Rebuke('Error getting interest list: ' + err?.message)
		}
	}

	// Create interest
	async createInterest(payload) {
		try {
			// Get interest with title
			const interestDuplicate = await Interest.findOne({
				title: payload.title
			})

			// Check if interest is public
			if (payload.public == 'true') {
				if (interestDuplicate && interestDuplicate.public && (interestDuplicate.categoryId == payload.categoryId))
					return new Rebuke('A public interest already exists for the category with the same title.')
			} else {
				if (interestDuplicate && currentUser.isUser(interestDuplicate.owner) && (interestDuplicate.categoryId == payload.categoryId))
					return new Rebuke('You have an existing private interest for the category with the same title.')
			}

			// Get and check category
			const category = await categoryService.findOne({
				_id: payload.categoryId
			})
			if (!category)
				return new Rebuke('The category is not valid.')

			// Create interest document
			const interest = new Interest({
				title: payload.title,
				description: payload.description,
				public: payload.public == 'true',
				categoryId: payload.categoryId,
				owner: currentUser.get('oid')
			})

			// Decorate photo to upload
			const photos = [{ 
				id: 'm1_' + helpers.uuidClean(),
				data: payload.photo,
				folder: config.env().CLOUDINARY_FOLDER_CAT_INT
			}]

			// Upload photos
			const uploadedPhotos = await cloudinary.upload(photos)

			// Check if image uploaded successfully
			if (!uploadedPhotos || !uploadedPhotos.length)
				return new Rebuke('[MI100] Error while creating interest.')

			// Update photo and save
			interest.photo = uploadedPhotos[0]
			const status = await interest.save()

			if (!status?._id)
				return new Rebuke('Interest could not be created.')

			return new Ok()
		} catch(err) {
			return new Rebuke('Error creating interest: ' + err?.message)
		}
	}

	// Get one interest
	async findOne(condition) {
		try {
			return await Interest.findOne(condition)
		} catch {
			return null
		}
	}

	// Follow interest
	async followInterest(payload) {
		try {
			// Define queries
			const interestQuery = { interestId: helpers.makeObjectId(payload.interestId) }
			const mainQuery = {
				followerId: currentUser.get('oid'),
				...interestQuery
			}

			// Get and check interest
			const interest = await Interest.findById(payload.interestId)
			if (!interest)
				return new Rebuke('Interest is invalid.')

			// Get relationship
			const relationship = await InterestFollower.findOne(mainQuery)

			// Check action
			const follow = (payload.follow == 'true')

			// If action is to follow
			if (follow) {
				if (relationship)
					return new Rebuke('User already follows interest.')

				// Create and save relationship
				const follower = new InterestFollower(mainQuery)
				const status = await follower.save()

				// Check if saved
				if (!status?._id)
					return new Rebuke('User could not be linked to interest.')
			} else {
				if (!relationship)
					return new Rebuke('User does not follow interest.')

				// Delete relationship
				const status = await InterestFollower.deleteOne(mainQuery)
				if (!status?.deletedCount)
					return new Rebuke('User could not be unlinked from interest.')				
			}

			return new Ok()
		} catch(err) {
			return new Rebuke('Error following interest: ' + err?.message)
		}
	}	

	// Invite to follow
	async inviteToFollow(payload) {
		try {
			// Get and check user
			const user = await profileService.getUserByEmail(payload.email)
			
			// Define queries
			const interestQuery = { interestId: helpers.makeObjectId(payload.interestId) }
			const mainQuery = {
				followerId: user.data?._id ?? '',
				...interestQuery
			}

			// Get and check interest
			const interest = await Interest.findById(payload.interestId)
			if (!interest)
				return new Rebuke('Interest is invalid.')

			// Get and check inviter
			const inviter = await profileService.getUserById(currentUser.get('id'))
			if (inviter.data.email == user.data?.email)
				return new Rebuke("C'mon! You can't invite yourself.")

			// Check if user exists on platform
			if (user.data && !user.error) {
				// Get and check relationship
				const relationship = await InterestFollower.findOne(mainQuery)
				if (relationship)
					return new Rebuke('User already follows interest.')
			}

			// Define invitation data
			const invitationData = {
				interestId: interestQuery.interestId,
				inviterId: inviter.data._id,
				inviteeEmail: cipher.encrypt(payload.email)
			}

			// Delete all previous invitations exists
			await InterestInvitation.deleteMany(invitationData)

			// Create new invitation
			const newInvitation = new InterestInvitation(invitationData)
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
						message: `You just invited '${payload.email}' to follow interest '${interest.title}'.`,
						subject: 'Interest Invite'
					}
				},
				{
					type: types.NotificationType.Email,
					email: {
						to: payload.email,
						message: `${inviter.data.name} has invited you to follow interest '${interest.title}'. Click on the link below to accept invitation.
						<br/>
						<br/>
						<a href="${acceptInvitationUrl}">${acceptInvitationUrl}</a>`,
						subject: 'Interest Invite'
					}
				}
			])

			return new Ok()
		} catch(err) {
			return new Rebuke('Error inviting user to follow interest: ' + err?.message)
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
			const invitation = await InterestInvitation.findById(ivData.ivId)
			if (!invitation || (invitation && invitation.inviteAccepted))
				return new Rebuke({ code: 1, message: 'Invitation is no longer valid.' })

			// Get and check interest
			const interest = await Interest.findById(invitation.interestId)
			if (!interest)
				return new Rebuke({ code: 2, message: 'Interest is no longer valid.' })

			// Get and check user
			let user = (await profileService.getUserByEmail(cipher.decrypt(invitation.inviteeEmail))).data

			// Check if this is an iv inquiry
			if (!payload?.authByInvitation) {
				// Check if there's a user signed in
				if (currentUser.get('id')) {
					// Check if signed in user is invitee
					if (currentUser.get('email') == cipher.decrypt(invitation.inviteeEmail)) {
						// Accept invitation
						return await this.acceptAndSettleInvite(invitation, user, interest)
					} else return new Rebuke({ code: 6, message: 'Signed in user is not the invitee.' })
				} else {
					if (user)
						return new Rebuke({ code: 7, message: 'User must sign in to accept invite.' })
					else {
						return new Rebuke({
							code: 5,
							message: 'Invitee does not exist. User should provide necessary details to create new account.',
							data: {
								interest: interest.title,
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
							return await this.acceptAndSettleInvite(invitation, user, interest)
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
					const opStatus = await this.acceptAndSettleInvite(invitation, user.data.account, interest)
					if (opStatus.error)
						return opStatus

					return new Ok({
						message: 'Invitation successfully accepted.',
						data: user.data.login
					})
				}
			}
		} catch(err) {
			return new Rebuke('Error processing interest invitation: ' + err?.message)
		}
	}

	// Accept invitation
	async acceptAndSettleInvite(invitation, user, interest) {
		try {
			// Accept invitation and save
			invitation.inviteAccepted = true
			invitation.save()

			// Define queries
			const interestQuery = { interestId: helpers.makeObjectId(invitation.interestId) }
			const mainQuery = {
				followerId: helpers.makeObjectId(user._id),
				...interestQuery
			}

			// Get and check relationship
			const relationship = await InterestFollower.findOne(mainQuery)
			if (relationship)
				return new Rebuke({ code: 3, message: 'User already follows interest.' })

			// Create and save relationship
			const follower = new InterestFollower(mainQuery)
			const status = await follower.save()

			// Check if saved
			if (!status?._id)
				return new Rebuke({ code: 4, message: 'User could not be linked to interest.' })

			// Get and check inviter
			const inviter = await profileService.getUserById(String(invitation.inviterId))
			
			// Notification service
			dispatcher.announce([
				{
					type: types.NotificationType.Email,
					email: {
						to: cipher.decrypt(inviter.data.email),
						message: `${user.name} has accepted your invitation to follow interest '${interest.title}'.`,
						subject: 'Invitation Accepted'
					}
				},
				{
					type: types.NotificationType.Email,
					email: {
						to: cipher.decrypt(user.email),
						message: `You accepted the invitation from '${inviter.data.name}', and now you're following interest '${interest.title}'.`,
						subject: `Interest '${interest.title}' Followed`
					}
				}
			])

			return new Ok('Invitation successfully accepted.')
		} catch(err){
			return new Rebuke()
		}
	}

	// Get one interest
	async findOne(condition) {
		try {
			return await Interest.findOne(condition)
		} catch {
			return null
		}
	}

	// Seed system interests
	async seedSystemInterests(interests) {
		try {
			// Check if data
			if (interests.length) {
				// Save interests
				await Interest.insertMany(interests)

				console.log(`[STATUS:INTEREST] Default system interests have just been seeded.`)
			}
		} catch(err) {}
	}
}


module.exports = new InterestService()