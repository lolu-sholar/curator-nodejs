/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Resource API
 * /api/resource/probe:
 *   put:
 *     summary: Verify and probe resource origin
 *     tags: [Resource]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProbeResourceDto'
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseResourceProbeDto'
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