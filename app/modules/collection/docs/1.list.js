/**
 * @swagger
 * tags:
 *   name: Interest
 *   description: Interest API
 * /api/interest/list:
 *   get:
 *     summary: Get list of public interests
 *     tags: [Interest]
 *     parameters:
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
 *               $ref: '#/components/schemas/OkResponseInterestListDto'
 *       500:
 *         description: Internal server error
 *
 */