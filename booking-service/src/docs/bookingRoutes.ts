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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               allOf:
 *                 - $ref: '#/components/schemas/Booking'
 *                 - type: object
 *                   properties:
 *                     priceBreakdown:
 *                       type: object
 *                       properties:
 *                         subtotal:
 *                           type: number
 *                           format: float
 *                         cleaningFee:
 *                           type: number
 *                           format: float
 *                         serviceFee:
 *                           type: number
 *                           format: float
 *                         currency:
 *                           type: string
 *                         nights:
 *                           type: integer
 *       400:
 *         description: Bad request - validation errors or unable to calculate price
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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
 *           format: uuid
 *         description: Filter by user ID (must be valid UUID)
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by property ID (must be valid UUID)
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
 *           format: uuid
 *         description: Booking ID (must be valid UUID)
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
 *           format: uuid
 *         description: Booking ID (must be valid UUID)
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
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         propertyId:
 *           type: string
 *           format: uuid
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Total price calculated by the system based on property pricing
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
 *       properties:
 *         propertyId:
 *           type: string
 *           format: uuid
 *           description: The ID of the property to book
 *         startDate:
 *           type: string
 *           format: date
 *           description: Check-in date (YYYY-MM-DD)
 *         endDate:
 *           type: string
 *           format: date
 *           description: Check-out date (YYYY-MM-DD)
 *       example:
 *         propertyId: "123e4567-e89b-12d3-a456-426614174000"
 *         startDate: "2025-08-01"
 *         endDate: "2025-08-05"
 */
