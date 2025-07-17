/**
 * @swagger
 * tags:
 *   - name: Booking
 *     description: Booking management endpoints
 */

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBooking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Get all bookings (by user or property)
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter by property ID
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   get:
 *     summary: Get booking details
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Booking not found
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
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         propertyId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         totalPrice:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateBooking:
 *       type: object
 *       required:
 *         - propertyId
 *         - startDate
 *         - endDate
 *         - totalPrice
 *       properties:
 *         propertyId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         totalPrice:
 *           type: number
 *           format: float
 *           minimum: 0
 */
