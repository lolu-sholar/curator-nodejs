/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 * /api/auth/login:
 *   post:
 *     summary: User sign in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginDto'
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseLoginDto'
 *       500:
 *         description: Internal server error
 *
 */