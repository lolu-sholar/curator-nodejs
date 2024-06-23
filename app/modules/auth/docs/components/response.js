/**
 * @swagger
 * components:
 *   schemas:
 *     OkResponseDto:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: Status code
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: null
 *           description: Response data
 *       example:
 *         code: 200
 *         message: Success
 *         data: null
 *         
 *     OkResponseRegisterDto:
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
 *             token:
 *               type: string
 *               description: Registration token needed to verify email address
 *       example:
 *         code: 200
 *         message: Success
 *         data:
 *           token: dG9rZW4tZGF0YQ==
 *         
 *     OkResponseLoginDto:
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
 *             name:
 *               type: string
 *               description: Name of the user
 *             email:
 *               type: string
 *               description: Email address of user
 *             accessToken:
 *               type: string
 *               description: Access token
 *             accountId:
 *               type: string
 *               description: User id
 *             clientSessionId:
 *               type: string
 *               description: Session id for client
 *       example:
 *         code: 200
 *         message: Success
 *         data:
 *           name: John Wick
 *           email: john.wick@email.com
 *           accessToken: dG9rZW4tZGF0YQ==
 *           clientSessionId: dG9rZW4tZGF0YQ==
 *
 *     RebukeResponseDto:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: Status code
 *         message:
 *           type: string
 *           description: Response message
 *       example:
 *         code: 0
 *         message: Example response message
 */