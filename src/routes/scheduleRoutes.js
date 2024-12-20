const express = require('express');
const { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Get all schedules by user ID
 *     description: Get a list of schedules that belong to the authenticated user.
 *     tags: [Schedules]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of schedules for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The schedule's unique identifier
 *                   title:
 *                     type: string
 *                     description: The schedule's title
 *                   start_date_time:
 *                     type: string
 *                     format: date-time
 *                     description: The start date and time of the schedule
 *                   end_date_time:
 *                     type: string
 *                     format: date-time
 *                     description: The end date and time of the schedule
 *                   reminder:
 *                     type: string
 *                     description: The reminder for the schedule
 *                   user_id:
 *                     type: string
 *                     description: The user ID of the schedule owner
 *       204:
 *         description: No schedules found for this user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No schedules found for this user."
 *                 schedules:
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
router.get('/', authenticate, getSchedules);
/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     summary: Get a specific schedule by user ID and schedule ID
 *     description: Get the details of a schedule for the authenticated user by schedule ID.
 *     tags: [Schedules]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the schedule.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Schedule found and details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the schedule
 *                 title:
 *                   type: string
 *                   description: The title of the schedule
 *                 start_date_time:
 *                   type: string
 *                   format: date-time
 *                   description: The start date and time of the schedule
 *                 end_date_time:
 *                   type: string
 *                   format: date-time
 *                   description: The end date and time of the schedule
 *                 reminder:
 *                   type: string
 *                   description: The reminder for the schedule
 *                 user_id:
 *                   type: string
 *                   description: The user ID of the schedule owner
 *       404:
 *         description: Schedule not found or the user does not have permission to view it
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule not found or you do not have permission to view it."
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
router.get('/:id', authenticate, getScheduleById);
/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a new schedule for the authenticated user
 *     description: This endpoint allows the authenticated user to create a new schedule by providing necessary details.
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the schedule.
 *                 example: "Meeting with team"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The start date of the schedule.
 *                 example: "2024-12-22"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: The start time of the schedule.
 *                 example: "10:00:00"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: The end date of the schedule.
 *                 example: "2024-12-22"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: The end time of the schedule.
 *                 example: "12:00:00"
 *               notes:
 *                 type: string
 *                 description: Additional notes or description for the schedule.
 *                 example: "Discussing project milestones"
 *               reminder:
 *                 type: integer
 *                 description: The reminder time in minutes before the schedule.
 *                 example: 30
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Schedule successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the schedule
 *                 title:
 *                   type: string
 *                   description: The title of the schedule
 *                 start_date_time:
 *                   type: string
 *                   format: date-time
 *                   description: The start date and time of the schedule
 *                 end_date_time:
 *                   type: string
 *                   format: date-time
 *                   description: The end date and time of the schedule
 *                 notes:
 *                   type: string
 *                   description: Additional notes for the schedule
 *                 reminder:
 *                   type: integer
 *                   description: Reminder time in minutes before the schedule
 *                 user_id:
 *                   type: string
 *                   description: The user ID of the schedule owner
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
router.post('/', authenticate, createSchedule);
/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     summary: Update an existing schedule for the authenticated user
 *     description: This endpoint allows the authenticated user to update the details of an existing schedule by providing the schedule ID in the URL and new schedule data in the request body.
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the schedule to update.
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
 *                 description: The title of the schedule.
 *                 example: "Meeting with the design team"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The start date of the schedule.
 *                 example: "2024-12-22"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: The start time of the schedule.
 *                 example: "10:00:00"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: The end date of the schedule.
 *                 example: "2024-12-22"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: The end time of the schedule.
 *                 example: "12:00:00"
 *               notes:
 *                 type: string
 *                 description: Additional notes or description for the schedule.
 *                 example: "Discussing the new design concepts"
 *               reminder:
 *                 type: integer
 *                 description: The reminder time in minutes before the schedule.
 *                 example: 30
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Schedule successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule updated successfully"
 *                 schedule:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the schedule
 *                     title:
 *                       type: string
 *                       description: The title of the schedule
 *                     start_date_time:
 *                       type: string
 *                       format: date-time
 *                       description: The start date and time of the schedule
 *                     end_date_time:
 *                       type: string
 *                       format: date-time
 *                       description: The end date and time of the schedule
 *                     notes:
 *                       type: string
 *                       description: Additional notes for the schedule
 *                     reminder:
 *                       type: integer
 *                       description: Reminder time for the schedule
 *                     user_id:
 *                       type: string
 *                       description: The user ID of the schedule owner
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
 *         description: Schedule not found or the user is not authorized to update this schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule not found or you are not authorized to update this schedule."
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
router.put('/:id', authenticate, updateSchedule);
/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: Delete a schedule for the authenticated user
 *     description: This endpoint allows the authenticated user to delete a schedule by providing the schedule ID in the URL.
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the schedule to delete.
 *         schema:
 *           type: string
 *           example: "60c72b2f9e8a2b001f8c0b65"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Schedule successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule deleted successfully"
 *       404:
 *         description: Schedule not found or the user is not authorized to delete this schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule not found or you are not authorized to delete this schedule."
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
router.delete('/:id', authenticate, deleteSchedule);

module.exports = router;