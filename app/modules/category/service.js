const { cipher, jtoken, helpers, futureDate, env, cloudinary, currentUser } = require('../../utils')
const { Ok, Issue, Rebuke } = require('../../utils/response')
const { Category, CategoryFollower, CategoryInvitation } = require('./model')
const profileService = require('../profile/service')
const authService = require('../auth/service')
const interestService = require('../interest/service')
const route = require('./route')
const config = require('../../manager/config')
const { dispatcher, types } = require('../../messaging')

class CategoryService {
	constructor(){
		// Seed categories and interests
		this.seedDefaultCategoriesAndInterests()
	}

	// Get category list
	async getCategoryList() {
		try {
			// Get list
			const list = await Category.aggregate([
				{ $match: {
						public: { $eq: true }	
				} },
				{ $lookup: {
	          from: 'users',
	          localField: 'owner',
	          foreignField: '_id',
	          as: 'ownerInfo'
        } },
        { $lookup: {
	          from: 'interests',
	          localField: '_id',
	          foreignField: 'categoryId',
	          as: 'catInterests'
        } },
        { $lookup: {
	          from: 'categoryFollowers',
	          localField: '_id',
	          foreignField: 'categoryId',
	          as: 'catFollowers'
        } },
				{ $project: {
						title: 1,
						description: 1,
						photo: "$photo.optimized",
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
						noInterests: {
							$size: '$catInterests'
						},
						noFollowers: {
							$size: '$catFollowers'
						},
						isSystemOwned: '$system',
						createdAt: 1,
				} }
			])

			return new Ok(list)
		} catch(err) {
			return new Rebuke('Error getting category list: ' + err?.message)
		}
	}

	// Create category
	async createCategory(payload) {
		try {
			// Get category exists with title
			const categoryDuplicate = await Category.findOne({
				title: payload.title
			})

			// Check if category is public
			if (payload.public == 'true') {
				if (categoryDuplicate && categoryDuplicate.public)
					return new Rebuke('A public category already exists with the provided title.')
			} else {
				if (categoryDuplicate && currentUser.isUser(categoryDuplicate.owner))
					return new Rebuke('You have an existing private category with the provided title.')
			}

			// Create category document
			const category = new Category({
				title: payload.title,
				description: payload.description,
				public: payload.public == 'true',
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
				return new Rebuke('[MC100] Error while creating category.')

			// Update photo and save
			category.photo = uploadedPhotos[0]
			const status = await category.save()

			if (!status?._id)
				return new Rebuke('Category could not be created.')

			return new Ok()
		} catch(err) {
			return new Rebuke('Error creating category: ' + err?.message)
		}
	}	

	// Follow category
	async followCategory(payload) {
		try {
			// Define queries
			const categoryQuery = { categoryId: helpers.makeObjectId(payload.categoryId) }
			const mainQuery = {
				followerId: currentUser.get('oid'),
				...categoryQuery
			}

			// Get and check category
			const category = await Category.findById(payload.categoryId)
			if (!category)
				return new Rebuke('Category is invalid.')

			// Get relationship
			const relationship = await CategoryFollower.findOne(mainQuery)

			// Check action
			const follow = (payload.follow == 'true')

			// If action is to follow
			if (follow) {
				if (relationship)
					return new Rebuke('User already follows category.')

				// Create and save relationship
				const follower = new CategoryFollower(mainQuery)
				const status = await follower.save()

				// Check if saved
				if (!status?._id)
					return new Rebuke('User could not be linked to category.')
			} else {
				if (!relationship)
					return new Rebuke('User does not follow category.')

				// Delete relationship
				const status = await CategoryFollower.deleteOne(mainQuery)
				if (!status?.deletedCount)
					return new Rebuke('User could not be unlinked from category.')

				// Remove all category interest exceptions
				
			}

			return new Ok()
		} catch(err) {
			return new Rebuke('Error creating category: ' + err?.message)
		}
	}	

	// Invite to follow
	async inviteToFollow(payload) {
		try {
			// Get and check user
			const user = await profileService.getUserByEmail(payload.email)
			
			// Define queries
			const categoryQuery = { categoryId: helpers.makeObjectId(payload.categoryId) }
			const mainQuery = {
				followerId: user.data?._id ?? '',
				...categoryQuery
			}

			// Get and check category
			const category = await Category.findById(payload.categoryId)
			if (!category)
				return new Rebuke('Category is invalid.')

			// Get and check inviter
			const inviter = await profileService.getUserById(currentUser.get('id'))
			if (inviter.data.email == user.data?.email)
				return new Rebuke("C'mon! You can't invite yourself.")

			// Check if user exists on platform
			if (user.data && !user.error) {
				// Get and check relationship
				const relationship = await CategoryFollower.findOne(mainQuery)
				if (relationship)
					return new Rebuke('User already follows category.')
			}

			// Define invitation data
			const invitationData = {
				categoryId: categoryQuery.categoryId,
				inviterId: inviter.data._id,
				inviteeEmail: cipher.encrypt(payload.email)
			}

			// Delete all previous invitations exists
			await CategoryInvitation.deleteMany(invitationData)

			// Create new invitation
			const newInvitation = new CategoryInvitation(invitationData)
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
						message: `You just invited '${payload.email}' to follow category '${category.title}'.`,
						subject: 'Category Invite'
					}
				},
				{
					type: types.NotificationType.Email,
					email: {
						to: payload.email,
						message: `${inviter.data.name} has invited you to follow category '${category.title}'. Click on the link below to accept invitation.
						<br/>
						<br/>
						<a href="${acceptInvitationUrl}">${acceptInvitationUrl}</a>`,
						subject: 'Category Invite'
					}
				}
			])

			return new Ok()
		} catch(err) {
			return new Rebuke('Error inviting user to follow category: ' + err?.message)
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
			const invitation = await CategoryInvitation.findById(ivData.ivId)
			if (!invitation || (invitation && invitation.inviteAccepted))
				return new Rebuke({ code: 1, message: 'Invitation is no longer valid.' })

			// Get and check category
			const category = await Category.findById(invitation.categoryId)
			if (!category)
				return new Rebuke({ code: 2, message: 'Category is no longer valid.' })

			// Get and check user
			let user = (await profileService.getUserByEmail(cipher.decrypt(invitation.inviteeEmail))).data

			// Check if this is an iv inquiry
			if (!payload?.authByInvitation) {
				// Check if there's a user signed in
				if (currentUser.get('id')) {
					// Check if signed in user is invitee
					if (currentUser.get('email') == cipher.decrypt(invitation.inviteeEmail)) {
						// Accept invitation
						return await this.acceptAndSettleInvite(invitation, user, category)
					} else return new Rebuke({ code: 6, message: 'Signed in user is not the invitee.' })
				} else {
					if (user)
						return new Rebuke({ code: 7, message: 'User must sign in to accept invite.' })
					else {
						return new Rebuke({
							code: 5,
							message: 'Invitee does not exist. User should provide necessary details to create new account.',
							data: {
								category: category.title,
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
							return await this.acceptAndSettleInvite(invitation, user, category)
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
					const opStatus = await this.acceptAndSettleInvite(invitation, user.data.account, category)
					if (opStatus.error)
						return opStatus

					return new Ok({
						message: 'Invitation successfully accepted.',
						data: user.data.login
					})
				}
			}
		} catch(err) {
			return new Rebuke('Error processing category invitation: ' + err?.message)
		}
	}

	// Accept invitation
	async acceptAndSettleInvite(invitation, user, category) {
		try {
			// Accept invitation and save
			invitation.inviteAccepted = true
			invitation.save()

			// Define queries
			const categoryQuery = { categoryId: helpers.makeObjectId(invitation.categoryId) }
			const mainQuery = {
				followerId: helpers.makeObjectId(user._id),
				...categoryQuery
			}

			// Get and check relationship
			const relationship = await CategoryFollower.findOne(mainQuery)
			if (relationship)
				return new Rebuke({ code: 3, message: 'User already follows category.' })

			// Create and save relationship
			const follower = new CategoryFollower(mainQuery)
			const status = await follower.save()

			// Check if saved
			if (!status?._id)
				return new Rebuke({ code: 4, message: 'User could not be linked to category.' })

			// Get and check inviter
			const inviter = await profileService.getUserById(String(invitation.inviterId))
			
			// Notification service
			dispatcher.announce([
				{
					type: types.NotificationType.Email,
					email: {
						to: cipher.decrypt(inviter.data.email),
						message: `${user.name} has accepted your invitation to follow category '${category.title}'.`,
						subject: 'Invitation Accepted'
					}
				},
				{
					type: types.NotificationType.Email,
					email: {
						to: cipher.decrypt(user.email),
						message: `You accepted the invitation from '${inviter.data.name}', and now you're following category '${category.title}'.`,
						subject: `Category '${category.title}' Followed`
					}
				}
			])

			return new Ok('Invitation successfully accepted.')
		} catch(err){
			return new Rebuke()
		}
	}

	// Seed default categories and interests
	async seedDefaultCategoriesAndInterests() {
		try {
			const query = { system: true, seeded: true }
			// Check if categories and interests data exist
			const category = await Category.findOne(query)
			const interest = await interestService.findOne(query)

			// Check if data
			if (!category || !interest) {
				const rawCategoriesData = require('../utility/data/category/seed')
				console.log(rawCategoriesData.length)
				const categories = []
				const interests = []

				// Loop through categories
				rawCategoriesData.forEach(c => {
					// Add category
					categories.push({
						_id: helpers.makeObjectId(c._id),
						title: c.title,
						description: c.description,
						photo: {
							imageId: c.image.imageId,
							url: c.image.url,
							optimized: c.image.optimized,
							format: c.image.format,
							author: c.image.author,
							authorUrl: c.image.authorUrl
						},
						system: true,
						seeded: true
					})

					// Loop through interests for category
					c.interests.forEach(i => {
						// Add interest
						interests.push({
							_id: helpers.makeObjectId(i._id),
							title: i.title,
							description: i.description,
							photo: {
								imageId: i.image.imageId,
								url: i.image.url,
								optimized: i.image.optimized,
								format: i.image.format,
								author: i.image.author,
								authorUrl: i.image.authorUrl
							},
							categoryId: helpers.makeObjectId(c._id),
							system: true,
							seeded: true
						})
					})
				})

				// Save categories and log to console
				if (!category)
					await Category.insertMany(categories)

				// Save interests and log to console
				if (!interest)
					interestService.seedSystemInterests(interests)
			}

			console.log(`[STATUS:CATEGORY] Default system categories ${!category ? 'have just been seeded' : 'already seeded'}.`)
			interest && console.log(`[STATUS:INTEREST] Default system interests already seeded.`)
		} catch(err) {}
	}
}


module.exports = new CategoryService()