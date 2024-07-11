/**
 * @swagger
 * tags:
 *   name: Interest
 *   description: Interest API
 * /api/interest/activate-invitation:
 *   get:
 *     summary: Get status and further possible instructions to activate invitation
 *     tags: [Interest]
 *     parameters:
 *       - in: query
 *         name: iv
 *         schema:
 *           type: string
 *         description: Invitation data sent to inbox
 *         required: true
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