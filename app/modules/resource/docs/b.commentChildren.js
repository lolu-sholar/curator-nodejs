/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Resource API
 * /api/resource/comment/children/list:
 *   get:
 *     summary: Get children comments for a comment 
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: commentId
 *         schema:
 *           type: string
 *         description: Parent comment id
 *         required: true
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseCommentListDto'
 *       500:
 *         description: Internal server error
 *
 */