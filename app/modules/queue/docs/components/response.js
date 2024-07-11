/**
 * @swagger
 * components:
 *   schemas:
 *     OkResponseInterestListDto:
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
 *             description:
 *               type: string
 *             category:
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
 *             noResources:
 *               type: number
 *             noFollowers:
 *               type: number
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
 *           description: Some description
 *           category:
 *             _id: 6df95e60801530a9025390gs
 *             title: Sample category
 *           owner:
 *             _id: 66695e60801530a902538e8d
 *             name: John Wick
 *           isSystemOwned: false
 *           noResources: 0
 *           noFollowers: 0
 *           createdAt: 2024-06-12T08:37:54.268Z
 *           photo: photo-url
 */