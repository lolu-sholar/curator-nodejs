/**
 * @swagger
 * components:
 *   schemas:
 *     ProbeResourceDto:
 *       type: object
 *       required:
 *         - url
 *         - wait
 *       properties:
 *         url:
 *           type: string
 *           description: Resource url
 *         wait:
 *           type: string
 *           enum: ['true', 'false']
 *           description: \'true\' to probe resource and wait for response
 *       example:
 *         url: https://www.example.com
 *         wait: false
 *         
 *     CreateResourceDto:
 *       type: object
 *       required:
 *         - probeId
 *         - title
 *         - description
 *         - public
 *         - interestId
 *       properties:
 *         probeId:
 *           type: string
 *           description: Probe id
 *         title:
 *           type: string
 *           description: Resource title (from probe or custom)
 *         description:
 *           type: string
 *           description: Resource description (from probe or custom)
 *         coverImageData:
 *           type: string
 *           description: Cover image for resource (if user is providing custom image)
 *         public:
 *           type: string
 *           enum: ['true', 'false']
 *           description: \'true\' make resource public or \'false\' to make it private
 *         interestId:
 *           type: string
 *           description: Interest id
 *       example:
 *         probeId: c8b06de6-91a7-458a-b0f9-2d94d9b544cc
 *         title: Some title
 *         description: Some description
 *         coverImageData: data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=...
 *         public: true
 *         interestId: 66695e60801530a902538e8c
 *         
 *     ReactToResourceDto:
 *       type: object
 *       required:
 *         - resourceId
 *         - like
 *       properties:
 *         resourceId:
 *           type: string
 *           description: Resource id
 *         like:
 *           type: string
 *           enum: ['true', 'false']
 *           description: \'true\' to like and \'false\' to unlike
 *       example:
 *         resourceId: 66695e60801530a902538e8c 
 *         like: true
 *         
 *     ReactToCommentDto:
 *       type: object
 *       required:
 *         - commentId
 *         - like
 *       properties:
 *         commentId:
 *           type: string
 *           description: Comment id
 *         like:
 *           type: string
 *           enum: ['true', 'false']
 *           description: \'true\' to like and \'false\' to unlike
 *       example:
 *         commentId: 66695e60801530a902538e8c 
 *         like: true
 *         
 *     CreateResourceCommentDto:
 *       type: object
 *       required:
 *         - resourceId
 *         - comment
 *       properties:
 *         resourceId:
 *           type: string
 *           description: Resource id
 *         commentId:
 *           type: string
 *           description: Parent comment id
 *         comment:
 *           type: string
 *           description: Comment body
 *       example:
 *         resourceId: 66695e60801530a902538e8c 
 *         commentId: 66695e60801530a902538e8c 
 *         comment: Some comment
 *         
 *     UpdateResourceCommentDto:
 *       type: object
 *       required:
 *         - commentId
 *         - comment
 *       properties:
 *         commentId:
 *           type: string
 *           description: Comment id
 *         comment:
 *           type: string
 *           description: Comment body
 *       example:
 *         commentId: 66695e60801530a902538e8c 
 *         comment: Some comment
 */