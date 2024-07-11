/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Resource API
 * /api/resource/comment/update:
 *   put:
 *     summary: Update comment
 *     tags: [Resource]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateResourceCommentDto'
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseResourceCommentDto'
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