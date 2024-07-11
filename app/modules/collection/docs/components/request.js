/**
 * @swagger
 * components:
 *   schemas:
 *     CreateInterestDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - public
 *         - photo
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *           description: Title of interest
 *         description:
 *           type: string
 *           description: Description of interest
 *         public:
 *           type: string
 *           enum: ['true', 'false']
 *           description: Visibility of interest
 *         photo:
 *           type: string
 *           description: Interest cover photo
 *         categoryId:
 *           type: string
 *           description: Interest category id
 *       example:
 *         title: Some interest
 *         description: Some description
 *         public: 'true'
 *         photo: data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=...
 *         categoryId: 66695e60801530a902538e8c
 *         
 *     FollowInterestDto:
 *       type: object
 *       required:
 *         - interestId
 *         - follow
 *       properties:
 *         interestId:
 *           type: string
 *           description: Interest id
 *         follow:
 *           type: string
 *           enum: ['true', 'false']
 *           description: \'true\' to follow interest and \'false\' to unfollow
 *       example:
 *         interestId: 66695e60801530a902538e8c
 *         follow: 'true'
 *         
 *     InviteToFollowInterestDto:
 *       type: object
 *       required:
 *         - interestId
 *         - email
 *       properties:
 *         interestId:
 *           type: string
 *           description: Interest id
 *         email:
 *           type: string
 *           description: Email address of invitee
 *       example:
 *         interestId: 66695e60801530a902538e8c
 *         email: john.wick@email.com
 */