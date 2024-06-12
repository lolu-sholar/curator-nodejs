/**
 * @swagger
 * components:
 *   schemas:
 *     OkResponseCategoryListDto:
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
 *             owner:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string 
 *             createdAt:
 *               type: string
 *             photo:
 *               type: string
 *             noInterests:
 *               type: number
 *             noFollowers:
 *               type: number
 *       example:
 *         code: 200
 *         message: Success
 *         data:
 *           _id: 66695e60801530a902538e8c
 *           title: Some title
 *           description: Some description
 *           owner:
 *             _id: 66695e60801530a902538e8d
 *             name: John Wick
 *           createdAt: 2024-06-12T08:37:54.268Z
 *           photo: photo-url
 *           noInterests: 0
 *           noFollowers: 0
 */