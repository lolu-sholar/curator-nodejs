/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category API
 * /api/category/list:
 *   get:
 *     summary: Get list of public categories
 *     tags: [Category]
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