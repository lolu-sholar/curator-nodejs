/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category API
 * /api/category/list:
 *   get:
 *     summary: Get list of public categories
 *     tags: [Category]
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
 *               $ref: '#/components/schemas/OkResponseCategoryListDto'
 *       500:
 *         description: Internal server error
 *
 */