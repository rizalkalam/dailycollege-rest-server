const express = require('express');  
const router = express.Router();  
const { getCalendar, getCalendarByDate, getCalendarById, addCalendar, editCalenderById, deleteCalender } = require('../controllers/calendarController');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /calendar:
 *   get:
 *     summary: Mendapatkan semua acara kalender
 *     description: Mengambil semua data acara dari koleksi CalendarEvent.
 *     tags: [Calendar]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data kalender berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data kalender berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67ab1af0c13b867bfda942d7"
 *                       title:
 *                         type: string
 *                         example: "Doctor Appointment"
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-16T00:00:00.000Z"
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-16T00:00:00.000Z"
 *                       color_accents:
 *                         type: object
 *                         properties:
 *                           color_id:
 *                             type: string
 *                             example: "67ab16bdb1254b813e8f9634"
 *                           color_name:
 *                             type: string
 *                             example: "Yellow"
 *                           color_value:
 *                             type: string
 *                             example: "#FFFF00"
 *       500:
 *         description: Kesalahan saat mengambil data kalender
 */
router.get('/', authenticate, getCalendar)

/**
 * @swagger
 * /calendar/date:
 *   get:
 *     summary: Mendapatkan data kalender berdasarkan tanggal
 *     description: Retrieve calendar events for a specific date.
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: '2025-02-16'
 *     tags: [Calendar]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of calendar events for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Data kalender berhasil diambil'
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '67ab1af0c13b867bfda942d7'
 *                       user_id:
 *                         type: string
 *                         example: '6773c14056bce40746399898'
 *                       title:
 *                         type: string
 *                         example: 'Doctor Appointment'
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         example: '2025-02-16'
 *                       endDate:
 *                         type: string
 *                         format: date
 *                         example: '2025-02-16'
 *                       startTime:
 *                         type: string
 *                         example: '14:00'
 *                       endTime:
 *                         type: string
 *                         example: '15:00'
 *                       note:
 *                         type: string
 *                         example: 'Annual check-up'
 *                       location:
 *                         type: string
 *                         example: 'Health Clinic'
 *                       reminderTime:
 *                         type: integer
 *                         example: 60
 *                       color_accents:
 *                         type: object
 *                         properties:
 *                           color_id:
 *                             type: string
 *                             example: '67ab16bdb1254b813e8f9636'
 *                           color_name:
 *                             type: string
 *                             example: 'Yellow'
 *                           color_value:
 *                             type: string
 *                             example: '#FFFF00'
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
router.get('/date', authenticate, getCalendarByDate )

/**
 * @swagger
 * /calendar/{id}:
 *   get:
 *     summary: Mendapatkan data kalender berdasarkan ID
 *     description: Mengambil data acara kalender berdasarkan ID yang diberikan.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dari acara kalender yang ingin diambil.
 *         schema:
 *           type: string
 *           example: 67ab1af0c13b867bfda942d7
 *     tags: [Calendar]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data kalender berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data kalender berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 67ab1af0c13b867bfda942d7
 *                     title:
 *                       type: string
 *                       example: Doctor Appointment
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: 2025-02-16
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: 2025-02-16
 *                     startTime:
 *                       type: string
 *                       example: "14:00"
 *                     endTime:
 *                       type: string
 *                       example: "15:00"
 *                     note:
 *                       type: string
 *                       example: Annual check-up
 *                     location:
 *                       type: string
 *                       example: Health Clinic
 *                     reminderTime:
 *                       type: integer
 *                       example: 60
 *       404:
 *         description: Acara kalender tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acara kalender tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil data kalender
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan saat mengambil data kalender
 */
router.get('/:id', authenticate, getCalendarById)

/**
 * @swagger
 * /calendar:
 *   post:
 *     summary: Menambahkan data kalender baru
 *     description: Menambahkan data acara kalender baru ke dalam database.
 *     tags: [Calendar]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Doctor Appointment"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-16"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-16"
 *               startTime:
 *                 type: string
 *                 example: "14:00"
 *               endTime:
 *                 type: string
 *                 example: "15:00"
 *               note:
 *                 type: string
 *                 example: "Annual check-up"
 *               location:
 *                 type: string
 *                 example: "Health Clinic"
 *               reminderTime:
 *                 type: integer
 *                 example: 60
 *               color_id:
 *                 type: string
 *                 example: "67ab16bdb1254b813e8f9636"  # ID warna yang valid
 *     responses:
 *       201:
 *         description: Data kalender berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data kalender berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67ab1af0c13b867bfda942d7"
 *                     title:
 *                       type: string
 *                       example: "Doctor Appointment"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-02-16"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-02-16"
 *                     startTime:
 *                       type: string
 *                       example: "14:00"
 *                     endTime:
 *                       type: string
 *                       example: "15:00"
 *                     note:
 *                       type: string
 *                       example: "Annual check-up"
 *                     location:
 *                       type: string
 *                       example: "Health Clinic"
 *                     reminderTime:
 *                       type: integer
 *                       example: 60
 *                     color_id:
 *                       type: string
 *                       example: "67ab16bdb1254b813e8f9636"
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Terjadi kesalahan saat menambahkan data kalender
 */
router.post('/', authenticate, addCalendar)

/**
 * @swagger
 * /calendar/{id}:
 *   put:
 *     summary: Mengedit data kalender berdasarkan ID
 *     description: Memperbarui data acara kalender yang ada berdasarkan ID yang diberikan.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID acara kalender yang ingin diperbarui
 *         schema:
 *           type: string
 *     tags: [Calendar]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Doctor Appointment"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-16"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-16"
 *               startTime:
 *                 type: string
 *                 example: "14:00"
 *               endTime:
 *                 type: string
 *                 example: "15:00"
 *               note:
 *                 type: string
 *                 example: "Annual check-up"
 *               location:
 *                 type: string
 *                 example: "Health Clinic"
 *               reminderTime:
 *                 type: integer
 *                 example: 60
 *               color_id:
 *                 type: string
 *                 example: "67ab16bdb1254b813e8f9636"
 *     responses:
 *       200:
 *         description: Data kalender berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data kalender berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67ab1af0c13b867bfda942d7"
 *                     title:
 *                       type: string
 *                       example: "Doctor Appointment"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-02-16"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-02-16"
 *                     startTime:
 *                       type: string
 *                       example: "14:00"
 *                     endTime:
 *                       type: string
 *                       example: "15:00"
 *                     note:
 *                       type: string
 *                       example: "Annual check-up"
 *                     location:
 *                       type: string
 *                       example: "Health Clinic"
 *                     reminderTime:
 *                       type: integer
 *                       example: 60
 *                     color_id:
 *                       type: string
 *                       example: "67ab16bdb1254b813e8f9636"
 *       404:
 *         description: Data tidak ditemukan atau tidak memiliki izin untuk mengedit
 *       500:
 *         description: Terjadi kesalahan saat memperbarui data kalender
 */
router.put('/:id', authenticate, editCalenderById)

/**
 * @swagger
 * /calendar/{id}:
 *   delete:
 *     summary: Menghapus data kalender berdasarkan ID
 *     description: Menghapus data acara kalender berdasarkan ID yang diberikan.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID data kalender yang ingin dihapus.
 *         schema:
 *           type: string
 *           example: "67ab1af0c13b867bfda942d7"
 *     tags: [Calendar]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data kalender berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data kalender berhasil dihapus."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67ab1af0c13b867bfda942d7"
 *                     title:
 *                       type: string
 *                       example: "Doctor Appointment"
 *       404:
 *         description: Data kalender tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat menghapus data kalender
 */
router.delete('/:id', authenticate, deleteCalender)

module.exports = router;  