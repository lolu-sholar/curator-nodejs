/**
 * @swagger
 * tags:
 *   name: Interest
 *   description: Interest API
 * /api/interest/create:
 *   post:
 *     summary: Create interest
 *     tags: [Interest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInterestDto'
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseDto'
 *       400:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RebukeResponseDto'
 *       500:
 *         description: Internal server error
 *
 */