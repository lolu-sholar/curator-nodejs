/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Resource API
 * /api/resource/comment/list:
 *   get:
 *     summary: Get list of comments for a resource
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: resourceId
 *         schema:
 *           type: string
 *         description: Resource id
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