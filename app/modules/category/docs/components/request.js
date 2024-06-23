/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategoryDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - public
 *         - photo
 *       properties:
 *         title:
 *           type: string
 *           description: Title of category
 *         description:
 *           type: string
 *           description: Description of category
 *         public:
 *           type: string
 *           enum: ['true', 'false']
 *           description: Visibility of category
 *         photo:
 *           type: string
 *           description: Category cover photo
 *       example:
 *         title: Some category
 *         description: Some description
 *         public: 'true'
 *         photo: data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=...
 *         
 *     FollowCategoryDto:
 *       type: object
 *       required:
 *         - categoryId
 *         - follow
 *       properties:
 *         categoryId:
 *           type: string
 *           description: Category id
 *         follow:
 *           type: string
 *           enum: ['true', 'false']
 *           description: \'true\' to follow category and \'false\' to unfollow
 *       example:
 *         categoryId: 66695e60801530a902538e8c
 *         follow: 'true'
 *         
 *     InviteToFollowCategoryDto:
 *       type: object
 *       required:
 *         - categoryId
 *         - email
 *       properties:
 *         categoryId:
 *           type: string
 *           description: Category id
 *         email:
 *           type: string
 *           description: Email address of invitee
 *       example:
 *         categoryId: 66695e60801530a902538e8c
 *         email: john.wick@email.com
 *         
 *     SettleInvitationDto:
 *       type: object
 *       required:
 *         - name
 *         - password
 *         - iv
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of user
 *         password:
 *           type: string
 *           description: Password of user (minimum of 6 chars. and maximum of 30 chars.)
 *         iv:
 *           type: string
 *           description: Invitation data sent to inbox
 *       example:
 *         name: John Wick
 *         password: Password123456
 *         iv: eyJhbGciOiJIUzI1NiIs...
 */