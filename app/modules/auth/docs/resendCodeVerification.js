/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 * /api/auth/resend-verification-code:
 *   put:
 *     summary: Resend account verification code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthResendCodeDto'
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseRegisterDto'
 *       500:
 *         description: Internal server error
 *
 */