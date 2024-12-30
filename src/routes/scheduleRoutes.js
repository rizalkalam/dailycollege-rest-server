const express = require('express');
const { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Mengambil semua jadwal dan aktivitas untuk pengguna yang terautentikasi
 *     description: Mengambil daftar jadwal (study dan activity) yang terkait dengan pengguna berdasarkan `user_id` yang terautentikasi.
 *     tags:
 *       - Schedules
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Jadwal dan aktivitas berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID Jadwal atau Aktivitas
 *                   user_id:
 *                     type: string
 *                     description: ID Pengguna yang memiliki jadwal
 *                   title:
 *                     type: string
 *                     description: Judul Jadwal atau Aktivitas
 *                   start_date_time:
 *                     type: string
 *                     format: date-time
 *                     description: Tanggal dan Waktu Mulai
 *                   end_date_time:
 *                     type: string
 *                     format: date-time
 *                     description: Tanggal dan Waktu Selesai
 *                   color:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nama warna yang dikaitkan
 *                       value:
 *                         type: string
 *                         description: Kode warna dalam format hex
 */
router.get('/', authenticate, getSchedules);

router.get('/:id', authenticate, getScheduleById);

router.post('/', authenticate, createSchedule);

router.put('/:id', authenticate, updateSchedule);

router.delete('/:id', authenticate, deleteSchedule);

module.exports = router;