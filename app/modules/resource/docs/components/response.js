/**
 * @swagger
 * components:
 *   schemas:
 *     OkResponseResourceListDto:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: Status code
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             titleCustom:
 *               type: string
 *             description:
 *               type: string
 *             descriptionCustom:
 *               type: string
 *             interest:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string 
 *             owner:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *             isSystemOwned:
 *               type: boolean
 *             createdAt:
 *               type: string
 *             photo:
 *               type: string
 *       example:
 *         code: 200
 *         message: Success
 *         data:
 *           _id: 66695e60801530a902538e8c
 *           title: Some title
 *           titleCustom: Some custom title
 *           description: Some description
 *           descriptionCustom: Some custom description
 *           interest:
 *             _id: 6df95e60801530a9025390gs
 *             title: Sample interest
 *           owner:
 *             _id: 66695e60801530a902538e8d
 *             name: John Wick
 *           isSystemOwned: false
 *           createdAt: 2024-06-12T08:37:54.268Z
 *           photo: photo-url
 *           
 *     OkResponseResourceProbeDto:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: Status code
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *           properties:
 *             probeId:
 *               type: string
 *       example:
 *         code: 200
 *         message: Success
 *         data:
 *           probeId: c8b06de6-91a7-458a-b0f9-2d94d9b544cc
 *           
 *     OkResponseProbeDataDto:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: Status code
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *           properties:
 *             _id:
 *               type: string
 *             probeId:
 *               type: string
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             platform:
 *               type: string
 *             coverImage:
 *               type: string
 *             url:
 *               type: string
 *             processedImage:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 imageId:
 *                   type: string
 *                 url:
 *                   type: string
 *                 optimized:
 *                   type: string
 *                 format:
 *                   type: string
 *                 cropped:
 *                   type: string
 *             status:
 *               type: string
 *             owner:
 *               type: string
 *             createdAt:
 *               type: string
 *       example:
 *         code: 200
 *         message: Success
 *         data:
 *           _id: 66695e60801530a902538e8c
 *           probeId: c8b06de6-91a7-458a-b0f9-2d94d9b544cc
 *           title: Resource title
 *           description: Resource description
 *           platform: Resource platform
 *           coverImage: photo-url
 *           url: resource-url
 *           processedImage:
 *             _id: 66695e60801530a902538e8c
 *             imageId: image-unique-id
 *             url: photo-url
 *             optimized: photo-url
 *             format: jpg
 *             cropped: photo-url
 *           status: success
 *           owner: 66695e60801530a902538e8c
 *           createdAt: 2024-06-27T11:00:02.993+00:00
 *           
 *     OkResponseNewResourceDto:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: Status code
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             titleCustom:
 *               type: string
 *             description:
 *               type: string
 *             descriptionCustom:
 *               type: string
 *             platform:
 *               type: string
 *             photo:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 imageId:
 *                   type: string
 *                 url:
 *                   type: string
 *                 optimized:
 *                   type: string
 *                 format:
 *                   type: string
 *                 cropped:
 *                   type: string
 *             createdAt:
 *               type: string
 *       example:
 *         code: 200
 *         message: Success
 *         data:
 *           _id: 66695e60801530a902538e8c
 *           title: Resource title
 *           titleCustom: Resource custom title
 *           description: Resource description
 *           descriptionCustom: Resource custom description
 *           platform: Resource platform
 *           photo:
 *             _id: 66695e60801530a902538e8c
 *             imageId: image-unique-id
 *             url: photo-url
 *             optimized: photo-url
 *             format: jpg
 *             cropped: photo-url
 *           createdAt: 2024-06-27T11:00:02.993+00:00
 *           
 *     OkResponseResourceCommentDto:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: Status code
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *           properties:
 *             _id:
 *               type: string
 *             resourceId:
 *               type: string
 *             parentCommentId:
 *               type: string
 *             comment:
 *               type: string
 *             edited:
 *               type: boolean
 *             commentBy:
 *               type: string
 *             createdAt:
 *               type: string
 *       example:
 *         code: 200
 *         message: Success
 *         data:
 *           _id: 66695e60801530a902538e8c
 *           resourceId: 66695e60801530a902538e8c
 *           parentCommentId: 66695e60801530a902538e8c
 *           comment: Some comment
 *           edited: false
 *           commentBy: 66695e60801530a902538e8c
 *           createdAt: 2024-06-27T11:00:02.993+00:00
 *           
 *     OkResponseAggregatedCommentDto:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         comment:
 *           type: string
 *         edited:
 *           type: boolean
 *         commenter:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         likes:
 *           type: number
 *         hasComments:
 *           type: boolean
 *         createdAt:
 *           type: string
 *       example:
 *         _id: 66695e60801530a902538e8c
 *         comment: Some comment
 *         edited: false 
 *         commenter:
 *           _id: 66695e60801530a902538e8c
 *           name: User name 
 *         likes: 0
 *         hasComments: true
 *         createdAt: 2024-06-27T11:00:02.993+00:00
 *           
 *     OkResponseCommentListDto:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: Status code
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OkResponseAggregatedCommentDto'
 *       example:
 *         code: 200
 *         message: Success
 *         data: [
 *           {
 *             _id: 66695e60801530a902538e8c,
 *             comment: Some comment,
 *             edited: false,
 *             commenter: {
 *               _id: 66695e60801530a902538e8c,
 *               name: User name
 *              },
 *             likes: 0,
 *             hasComments: true,
 *             createdAt: 2024-06-27T11:00:02.993+00:00
 *           }
 *         ]
 *           
 *             
 */