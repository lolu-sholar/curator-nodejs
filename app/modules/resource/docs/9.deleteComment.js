/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Resource API
 * /api/resource/comment/delete:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: commentId
 *         schema:
 *           type: string
 *         description: Comment id
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