/**
 * @swagger
 * tags:
 *   - name: Location
 *     description: Location search and geocoding endpoints
 */

/**
 * @swagger
 * /api/v1/location/autocomplete:
 *   get:
 *     summary: City autocomplete suggestions
 *     description: Get lightweight city suggestions (no coordinates). Call /place/:placeId to get coordinates.
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: City name or partial city name to search for
 *         example: "Par"
 *     responses:
 *       200:
 *         description: List of city suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       placeId:
 *                         type: string
 *                         description: Google Place ID (use this to get coordinates)
 *                         example: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ"
 *                       description:
 *                         type: string
 *                         description: Full place description
 *                         example: "Paris, France"
 *                       mainText:
 *                         type: string
 *                         description: Primary text (usually city name)
 *                         example: "Paris"
 *                       secondaryText:
 *                         type: string
 *                         description: Secondary text (usually country)
 *                         example: "France"
 *       400:
 *         description: Query parameter missing or invalid
 *       500:
 *         description: Server error or geocoding service unavailable
 */

/**
 * @swagger
 * /api/v1/location/place/{placeId}:
 *   get:
 *     summary: Get place details with coordinates
 *     description: Get full details including lat/lng for a selected place. Call this when user selects from autocomplete.
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Google Place ID from autocomplete
 *         example: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ"
 *     responses:
 *       200:
 *         description: Place details with coordinates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 placeId:
 *                   type: string
 *                   example: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ"
 *                 city:
 *                   type: string
 *                   example: "Paris"
 *                 country:
 *                   type: string
 *                   example: "France"
 *                 description:
 *                   type: string
 *                   example: "Paris, France"
 *                 lat:
 *                   type: number
 *                   format: float
 *                   example: 48.8566
 *                 lng:
 *                   type: number
 *                   format: float
 *                   example: 2.3522
 *       400:
 *         description: Place ID missing
 *       404:
 *         description: Place not found
 *       500:
 *         description: Server error
 */
