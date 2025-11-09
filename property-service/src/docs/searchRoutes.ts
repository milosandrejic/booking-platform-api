/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Property search and location autocomplete endpoints
 */

/**
 * @swagger
 * /api/v1/property/search/autocomplete:
 *   get:
 *     summary: City autocomplete suggestions
 *     description: Get lightweight city suggestions (no coordinates). Call /place-details with placeId to get coordinates.
 *     tags: [Search]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Query parameter is required"
 *       500:
 *         description: Server error or geocoding service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch autocomplete suggestions"
 */

/**
 * @swagger
 * /api/v1/property/search/place/{placeId}:
 *   get:
 *     summary: Get place details with coordinates
 *     description: Get full details including lat/lng for a selected place. Call this when user selects from autocomplete.
 *     tags: [Search]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Place ID is required"
 *       404:
 *         description: Place not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Place not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch place details"
 */

/**
 * @swagger
 * /api/v1/property/search:
 *   post:
 *     summary: Search properties by location
 *     description: Search for properties near a specific location with filters (To be implemented)
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *             properties:
 *               location:
 *                 type: object
 *                 required:
 *                   - lat
 *                   - lng
 *                   - radius
 *                 properties:
 *                   lat:
 *                     type: number
 *                     format: float
 *                     description: Latitude
 *                     example: 48.8566
 *                   lng:
 *                     type: number
 *                     format: float
 *                     description: Longitude
 *                     example: 2.3522
 *                   radius:
 *                     type: number
 *                     format: float
 *                     description: Search radius in kilometers
 *                     example: 25
 *               filters:
 *                 type: object
 *                 properties:
 *                   minPrice:
 *                     type: number
 *                     format: float
 *                   maxPrice:
 *                     type: number
 *                     format: float
 *                   propertyTypes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   guests:
 *                     type: integer
 *               page:
 *                 type: integer
 *                 default: 1
 *               limit:
 *                 type: integer
 *                 default: 20
 *     responses:
 *       501:
 *         description: Not yet implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Search endpoint not yet implemented"
 */
