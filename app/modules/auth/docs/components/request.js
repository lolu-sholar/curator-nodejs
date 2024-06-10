/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRegisterDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of user
 *         email:
 *           type: string
 *           description: Email address of user
 *         password:
 *           type: string
 *           description: Password of user (minimum of 6 chars. and maximum of 30 chars.)
 *       example:
 *         name: John Wick
 *         email: john.wick@email.com
 *         password: Password123456
 
 *     AuthLoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email address of user
 *         password:
 *           type: string
 *           description: Password of user (minimum of 6 chars. and maximum of 30 chars.)
 *       example:
 *         email: john.wick@email.com
 *         password: Password123456
 *
 *     AuthVerifyEmailDto:
 *       type: object
 *       required:
 *         - code
 *         - email
 *         - token
 *       properties:
 *         code:
 *           type: string
 *           description: Verification code sent to user
 *         email:
 *           type: string
 *           description: Email address of user
 *         token:
 *           type: string
 *           description: Token passed from previous operation
 *       example:
 *         code: 123456
 *         email: john.wick@email.com
 *         token: dG9rZW4tZGF0YQ== 
 *
 *     AuthResendCodeDto:
 *       type: object
 *       required:
 *         - email
 *         - token
 *       properties:
 *         email:
 *           type: string
 *           description: Email address of user
 *         token:
 *           type: string
 *           description: Token passed from previous operation
 *       example:
 *         email: john.wick@email.com
 *         token: dG9rZW4tZGF0YQ== 
 *
 *     AuthForgotPasswordDto:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: Email address of user
 *       example:
 *         email: john.wick@email.com
 *
 *     AuthResetPasswordDto:
 *       type: object
 *       required:
 *         - code
 *         - email
 *         - password
 *         - token
 *       properties:
 *         code:
 *           type: string
 *           description: Verification code sent to user
 *         email:
 *           type: string
 *           description: Email address of user
 *         password:
 *           type: string
 *           description: Password of user (minimum of 6 chars. and maximum of 30 chars.)
 *         token:
 *           type: string
 *           description: Token passed from previous operation
 *       example:
 *         code: 123456
 *         email: john.wick@email.com
 *         password: Password123456
 *         token: dG9rZW4tZGF0YQ== 
 */