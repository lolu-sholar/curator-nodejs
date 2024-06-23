/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category API
 * /api/category/activate-invitation:
 *   get:
 *     summary: Get status of invitation and further possible instructions
 *     tags: [Category]
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