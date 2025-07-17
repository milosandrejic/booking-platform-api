/**
 * @swagger
 * tags:
 *   - name: Property
 *     description: Property management endpoints
 *   - name: PropertyReview
 *     description: Property review management endpoints
 */

/**
 * @swagger
 * /api/v1/property:
 *   post:
 *     summary: Create a new property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProperty'
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/property/{id}:
 *   patch:
 *     summary: Update property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProperty'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */

/**
 * @swagger
 * /api/v1/property/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */

/**
 * @swagger
 * /api/v1/property/{id}:
 *   delete:
 *     summary: Delete property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */

/**
 * @swagger
 * /api/v1/properties/{ownerId}/list:
 *   get:
 *     summary: Get properties for a specific owner
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No properties found
 */

/**
 * @swagger
 * /api/v1/property/review:
 *   post:
 *     summary: Create a new property review
 *     tags: [PropertyReview]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyReview'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyReview'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/property/review/{id}:
 *   patch:
 *     summary: Update property review
 *     tags: [PropertyReview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePropertyReview'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyReview'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/v1/property/review/{id}:
 *   get:
 *     summary: Get property review by ID
 *     tags: [PropertyReview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyReview'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/v1/property/review/{id}:
 *   delete:
 *     summary: Delete property review
 *     tags: [PropertyReview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/v1/property/review/{propertyId}/list:
 *   get:
 *     summary: Get reviews for a specific property
 *     tags: [PropertyReview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyReview'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No reviews found
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         ownerId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         location:
 *           type: object
 *           description: GeoJSON Point
 *         addressLine:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *         isActive:
 *           type: boolean
 *         type:
 *           type: string
 *           enum: [APARTMENT, HOTEL, GUEST_HOUSE, HOSTEL, HOMESTAY, BED_AND_BREAKFAST, HOLIDAY_HOME, VILLA, MOTEL, BOAT, CHALET, RESORT]
 *         facilities:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateProperty:
 *       type: object
 *       required:
 *         - ownerId
 *         - title
 *         - description
 *         - price
 *         - location
 *         - addressLine
 *         - city
 *         - state
 *         - postalCode
 *         - country
 *         - type
 *       properties:
 *         ownerId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *         location:
 *           type: object
 *           description: GeoJSON Point
 *         addressLine:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *         type:
 *           type: string
 *           enum: [APARTMENT, HOTEL, GUEST_HOUSE, HOSTEL, HOMESTAY, BED_AND_BREAKFAST, HOLIDAY_HOME, VILLA, MOTEL, BOAT, CHALET, RESORT]
 *         facilities:
 *           type: array
 *           items:
 *             type: string
 *     UpdateProperty:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *         location:
 *           type: object
 *           description: GeoJSON Point
 *         addressLine:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *         isActive:
 *           type: boolean
 *         type:
 *           type: string
 *           enum: [APARTMENT, HOTEL, GUEST_HOUSE, HOSTEL, HOMESTAY, BED_AND_BREAKFAST, HOLIDAY_HOME, VILLA, MOTEL, BOAT, CHALET, RESORT]
 *         facilities:
 *           type: array
 *           items:
 *             type: string
 *     PropertyReview:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         propertyId:
 *           type: string
 *         userId:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreatePropertyReview:
 *       type: object
 *       required:
 *         - propertyId
 *         - userId
 *         - rating
 *         - comment
 *       properties:
 *         propertyId:
 *           type: string
 *         userId:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           minLength: 1
 *     UpdatePropertyReview:
 *       type: object
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           minLength: 1
 */
