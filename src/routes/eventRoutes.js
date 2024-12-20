const express = require('express');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events by user ID
 *     description: Get a list of events that belong to the authenticated user.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of events for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The event's unique identifier
 *                   title:
 *                     type: string
 *                     description: The event's title
 *                   start_date_time:
 *                     type: string
 *                     format: date-time
 *                     description: The start date and time of the event
 *                   end_date_time:
 *                     type: string
 *                     format: date-time
 *                     description: The end date and time of the event
 *                   reminder:
 *                     type: string
 *                     description: The reminder for the event
 *                   user_id:
 *                     type: string
 *                     description: The user ID of the event owner
 *       200:
 *         description: No events found for this user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No events found for this user."
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.get('/', authenticate, getEvents);
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a specific event by user ID and event ID
 *     description: Get the details of an event for the authenticated user by event ID.
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the event.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event found and details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the event
 *                 title:
 *                   type: string
 *                   description: The title of the event
 *                 start_date_time:
 *                   type: string
 *                   format: date-time
 *                   description: The start date and time of the event
 *                 end_date_time:
 *                   type: string
 *                   format: date-time
 *                   description: The end date and time of the event
 *                 reminder:
 *                   type: string
 *                   description: The reminder for the event
 *                 user_id:
 *                   type: string
 *                   description: The user ID of the event owner
 *       404:
 *         description: Event not found or the user does not have permission to view it
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found or you do not have permission to view it."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   example: "Some internal server error message"
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.get('/:id', authenticate, getEventById);
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event for the authenticated user
 *     description: This endpoint allows the authenticated user to create a new event by providing necessary details.
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the event.
 *                 example: "Meeting with team"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The start date of the event.
 *                 example: "2024-12-22"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: The start time of the event.
 *                 example: "10:00:00"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: The end date of the event.
 *                 example: "2024-12-22"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: The end time of the event.
 *                 example: "12:00:00"
 *               notes:
 *                 type: string
 *                 description: Additional notes or description for the event.
 *                 example: "Discussing project milestones"
 *               reminder:
 *                 type: integer
 *                 description: The reminder time in minutes before the event.
 *                 example: 30
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Event successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the event
 *                 title:
 *                   type: string
 *                   description: The title of the event
 *                 start_date_time:
 *                   type: string
 *                   format: date-time
 *                   description: The start date and time of the event
 *                 end_date_time:
 *                   type: string
 *                   format: date-time
 *                   description: The end date and time of the event
 *                 notes:
 *                   type: string
 *                   description: Additional notes for the event
 *                 reminder:
 *                   type: string
 *                   description: Reminder time for the event
 *                 user_id:
 *                   type: string
 *                   description: The user ID of the event owner
 *       400:
 *         description: Bad Request, required fields are missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Title, start date, start time, end date, and end time are required."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   example: "Some internal server error message"
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.post('/', authenticate, createEvent);
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event for the authenticated user
 *     description: This endpoint allows the authenticated user to update the details of an existing event by providing the event ID in the URL and new event data in the request body.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to update.
 *         schema:
 *           type: string
 *           example: "60c72b2f9e8a2b001f8c0b65"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the event.
 *                 example: "Meeting with the design team"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The start date of the event.
 *                 example: "2024-12-22"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: The start time of the event.
 *                 example: "10:00:00"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: The end date of the event.
 *                 example: "2024-12-22"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: The end time of the event.
 *                 example: "12:00:00"
 *               notes:
 *                 type: string
 *                 description: Additional notes or description for the event.
 *                 example: "Discussing the new design concepts"
 *               reminder:
 *                 type: integer
 *                 description: The reminder time in minutes before the event.
 *                 example: 30
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event updated successfully"
 *                 event:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the event
 *                     title:
 *                       type: string
 *                       description: The title of the event
 *                     start_date_time:
 *                       type: string
 *                       format: date-time
 *                       description: The start date and time of the event
 *                     end_date_time:
 *                       type: string
 *                       format: date-time
 *                       description: The end date and time of the event
 *                     notes:
 *                       type: string
 *                       description: Additional notes for the event
 *                     reminder:
 *                       type: string
 *                       description: Reminder time for the event
 *                     user_id:
 *                       type: string
 *                       description: The user ID of the event owner
 *       400:
 *         description: Bad Request, invalid data or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Title, start date, start time, end date, and end time are required."
 *       404:
 *         description: Event not found or the user is not authorized to update this event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found or you are not authorized to update this event."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   example: "Some internal server error message"
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.post('/:id', authenticate, updateEvent);
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event for the authenticated user
 *     description: This endpoint allows the authenticated user to delete an event by providing the event ID in the URL.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to delete.
 *         schema:
 *           type: string
 *           example: "60c72b2f9e8a2b001f8c0b65"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       404:
 *         description: Event not found or the user is not authorized to delete this event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found or you are not authorized to delete this event."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   example: "Some internal server error message"
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.delete('/:id', authenticate, deleteEvent);

module.exports = router;