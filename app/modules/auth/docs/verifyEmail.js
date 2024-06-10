/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 * /api/auth/verify-email:
 *   put:
 *     summary: Verify email address
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthVerifyEmailDto'
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseDto'
 *       500:
 *         description: Internal server error
 *
 */