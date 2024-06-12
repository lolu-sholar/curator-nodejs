const { cipher, jtoken, helpers, futureDate, env, cloudinary, currentUser } = require('../../utils')
const { Ok, Rebuke } = require('../../utils/response')
const { Category } = require('./model/category')
const { CategoryFollower } = require('./model/follower')
const profileService = require('../profile/service')
const { dispatcher, types } = require('../../messaging')

class CategoryService {
	constructor(){}

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
				{ $project: {
					title: 1,
					description: 1,
					photo: "$photo.optimized",
					owner: {
						_id: { $first: "$ownerInfo._id" },
						name: { $first: "$ownerInfo.name" }
					},
					noInterests: {
						$size: {
							$ifNull: [[], []]
						}
					},
					noFollowers: {
						$size: {
							$ifNull: [[], []]
						}
					},
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
			// Create category document
			const category = new Category({
				title: payload.title,
				description: payload.description,
				public: payload.public == 'true',
				owner: currentUser.get('oid')
			})

			// Decorate photo to upload
			const photos = [{ id: helpers.uuidClean(), data: payload.photo }]

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
					return new Rebuke('User could not linked to category.')
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
			if (user.error || !user.data)
				return new Rebuke('User is not valid.')
			
			// Define queries
			const categoryQuery = { categoryId: helpers.makeObjectId(payload.categoryId) }
			const mainQuery = {
				followerId: user.data._id,
				...categoryQuery
			}

			// Get and check category
			const category = await Category.findById(payload.categoryId)
			if (!category)
				return new Rebuke('Category is invalid.')

			// Get and check inviter
			const inviter = await profileService.getUserById(currentUser.get('id'))
			if (inviter.data.email == user.data.email)
				return new Rebuke("C'mon! You can't invite yourself.")

			// Get and check relationship
			const relationship = await CategoryFollower.findOne(mainQuery)
			if (relationship)
				return new Rebuke('User already follows category.')

			// Notification service
			dispatcher.announce({
				type: types.NotificationType.Email,
				email: {
					to: payload.email,
					message: `${inviter.data.name} has invited you to join category '${category.title}'. Click on the link below to join.`,
					subject: 'Category Invite'
				}
			})

			return new Ok()
		} catch(err) {
			return new Rebuke('Error inviting user to follow category: ' + err?.message)
		}
	}
}


module.exports = new CategoryService()