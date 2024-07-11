/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Resource API
 * /api/resource/list/for-interest:
 *   get:
 *     summary: Get list of public resources for an interest
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: interestId
 *         schema:
 *           type: string
 *         description: Interest id
 *         required: true
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageLimit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseResourceListDto'
 *       500:
 *         description: Internal server error
 *
 */