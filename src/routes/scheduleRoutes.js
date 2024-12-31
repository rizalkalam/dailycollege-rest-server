const express = require('express');
const { getSchedules, deleteScheduleById } = require('../controllers/scheduleController');
const { createStudySchedule, editStudySchedule } = require('../controllers/studyController');
const { createActivitySchedule, editActivitySchedule } = require('../controllers/activityController');
const { getColors } = require('../controllers/colorController');
const { getDays } = require('../controllers/dayController');
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

// router.get('/:id', authenticate, getScheduleById);

/**
 * @swagger
 * /schedules/study:
 *   post:
 *     summary: Buat Jadwal kuliah Baru
 *     description: Membuat jadwal kuliah baru dengan data yang diberikan.
 *     tags:
 *       - Schedules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mathematics"
 *               day_id:
 *                 type: string
 *                 example: "64ec3b3a1c4f5b001a5cbe76"
 *               start_time:
 *                 type: string
 *                 example: "08:00"
 *               end_time:
 *                 type: string
 *                 example: "10:00"
 *               place:
 *                 type: string
 *                 example: "Library"
 *               room:
 *                 type: string
 *                 example: "3B.TV"
 *               color_id:
 *                 type: string
 *                 example: "64ec3b3a1c4f5b001a5cbe78"
 *     responses:
 *       201:
 *         description: Jadwal kuliah berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jadwal kuliah berhasil dibuat."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe79"
 *                     title:
 *                       type: string
 *                       example: "Mathematics"
 *                     day_id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe76"
 *                     start_time:
 *                       type: string
 *                       example: "08:00"
 *                     end_time:
 *                       type: string
 *                       example: "10:00"
 *                     place:
 *                       type: string
 *                       example: "Library"
 *                     room:
 *                       type: string
 *                       example: "3B.TV"
 *                     color_id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe78"
 *       400:
 *         description: Semua input data harus diisi.
 *       404:
 *         description: Data hari atau warna tidak ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
router.post('/study', authenticate, createStudySchedule);

/**
 * @swagger
 * /schedules/study/{id}:
 *   put:
 *     summary: Edit Jadwal kuliah
 *     description: Mengubah data jadwal kuliah yang sudah ada
 *     tags:
 *       - Schedules
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID jadwal kuliah yang akan diedit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mathematics"
 *               day_id:
 *                 type: string
 *                 example: "64ec3b3a1c4f5b001a5cbe76"
 *               start_time:
 *                 type: string
 *                 example: "08:00"
 *               end_time:
 *                 type: string
 *                 example: "10:00"
 *               place:
 *                 type: string
 *                 example: "Library"
 *               room:
 *                 type: string
 *                 example: "3B.TV"
 *               color_id:
 *                 type: string
 *                 example: "64ec3b3a1c4f5b001a5cbe78"
 *     responses:
 *       200:
 *         description: Jadwal kuliah berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jadwal kuliah berhasil diperbarui."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe79"
 *                     title:
 *                       type: string
 *                       example: "Mathematics"
 *                     day_id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe76"
 *                     start_time:
 *                       type: string
 *                       example: "08:00"
 *                     end_time:
 *                       type: string
 *                       example: "10:00"
 *                     place:
 *                       type: string
 *                       example: "Library"
 *                     room:
 *                       type: string
 *                       example: "3B.TV"
 *                     color_id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe78"
 *       400:
 *         description: Input data tidak lengkap
 *       404:
 *         description: Data hari atau warna tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
router.put('/study/:id', authenticate, editStudySchedule);

/**
 * @swagger
 * /schedules/activity:
 *   post:
 *     summary: Buat Jadwal Aktivitas Baru
 *     description: Membuat jadwal aktivitas baru dengan data yang diberikan.
 *     tags:
 *       - Schedules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Physics Experiment"
 *               description:
 *                 type: string
 *                 example: "Experimenting with wave properties."
 *               day_id:
 *                 type: string
 *                 example: "64ec3b3a1c4f5b001a5cbe76"
 *               start_time:
 *                 type: string
 *                 example: "14:00"
 *               end_time:
 *                 type: string
 *                 example: "16:00"
 *               color_id:
 *                 type: string
 *                 example: "64ec3b3a1c4f5b001a5cbe78"
 *     responses:
 *       201:
 *         description: Aktivitas berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aktivitas berhasil dibuat."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe79"
 *                     title:
 *                       type: string
 *                       example: "Physics Experiment"
 *                     description:
 *                       type: string
 *                       example: "Experimenting with wave properties."
 *                     day_id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe76"
 *                     start_time:
 *                       type: string
 *                       example: "14:00"
 *                     end_time:
 *                       type: string
 *                       example: "16:00"
 *                     color_id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe78"
 *       400:
 *         description: Semua input data harus diisi.
 *       404:
 *         description: Data hari atau warna tidak ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
router.post('/activity', authenticate, createActivitySchedule);

/**
 * @swagger
 * /schedules/activity/{id}:
 *   put:
 *     summary: Edit Jadwal Aktivitas
 *     description: Mengubah data aktivitas yang sudah ada
 *     tags:
 *       - Schedules
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID aktivitas yang akan diedit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Praktikum Fisika"
 *               description:
 *                 type: string
 *                 example: "Melakukan eksperimen gelombang"
 *               day_id:
 *                 type: string
 *                 example: "64ec3b3a1c4f5b001a5cbe76"
 *               start_time:
 *                 type: string
 *                 example: "14:00"
 *               end_time:
 *                 type: string
 *                 example: "16:00"
 *               color_id:
 *                 type: string
 *                 example: "64ec3b3a1c4f5b001a5cbe78"
 *     responses:
 *       200:
 *         description: Aktivitas berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aktivitas berhasil diperbarui."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe79"
 *                     title:
 *                       type: string
 *                       example: "Praktikum Fisika"
 *                     description:
 *                       type: string
 *                       example: "Melakukan eksperimen gelombang"
 *                     day_id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe76"
 *                     start_time:
 *                       type: string
 *                       example: "14:00"
 *                     end_time:
 *                       type: string
 *                       example: "16:00"
 *                     color_id:
 *                       type: string
 *                       example: "64ec3b3a1c4f5b001a5cbe78"
 *       400:
 *         description: Input data tidak lengkap
 *       404:
 *         description: Data hari atau warna tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
router.put('/activity/:id', authenticate, editActivitySchedule);

/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: "Menghapus data jadwal (study atau activity) berdasarkan ID"
 *     description: "Endpoint untuk menghapus data dari koleksi `Activity` atau `Study` berdasarkan ID yang diberikan."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari jadwal yang ingin dihapus."
 *         schema:
 *           type: string
 *     tags:
 *       - Schedules
 *     responses:
 *       200:
 *         description: "Berhasil menghapus data jadwal."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data activity berhasil dihapus."
 *       404:
 *         description: "ID tidak ditemukan pada koleksi Activity atau Study."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data dengan ID tersebut tidak ditemukan."
 *       500:
 *         description: "Kesalahan server saat menghapus data."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kesalahan server."
 */
router.delete('/:id', authenticate, deleteScheduleById);

/**
 * @swagger
 * /schedules/colors:
 *   get:
 *     summary: "Informasi data semua warna"
 *     description: "Endpoint untuk mendapatkan data semua warna yang tersedia di sistem."
 *     tags:
 *       - Schedules
 *     responses:
 *       200:
 *         description: "Berhasil mengambil data warna."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data warna berhasil diambil."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       color_name:
 *                         type: string
 *                         example: "Red"
 *                       color_value:
 *                         type: string
 *                         example: "#FF4545"
 *       500:
 *         description: "Gagal memuat data warna."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gagal memuat data warna."
 */
router.get('/colors', getColors);

/**
 * @swagger
 * /schedules/days:
 *   get:
 *     summary: "Informas data hari"
 *     description: "Endpoint untuk mendapatkan data semua hari yang tersedia di sistem."
 *     tags:
 *       - Schedules
 *     responses:
 *       200:
 *         description: "Berhasil mengambil data hari."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data hari berhasil diambil."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Monday"
 *       500:
 *         description: "Gagal memuat data hari."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gagal memuat data hari."
 */
router.get('/days', getDays);

module.exports = router;