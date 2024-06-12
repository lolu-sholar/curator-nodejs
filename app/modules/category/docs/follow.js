/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category API
 * /api/category/follow:
 *   put:
 *     summary: Follow category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowCategoryDto'
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseDto'
 *       500:
 *         description: Internal server error
 *
 */