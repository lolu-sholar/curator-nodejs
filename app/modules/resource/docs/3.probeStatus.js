/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Resource API
 * /api/resource/probe/status:
 *   get:
 *     summary: Get resource probe status
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: probeId
 *         schema:
 *           type: string
 *         description: Probe id
 *         required: true
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResponseProbeDataDto'
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