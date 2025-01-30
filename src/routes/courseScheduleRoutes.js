const express = require('express');  
const router = express.Router(); 
const { getCourseSchedulesByDay, getCourseSchedulesByDayId, getCourseScheduleById, addCourseSchedule, updateCourseSchedulesByDayId, updateCourseScheduleById, deleteCourseSchedule } = require('../controllers/courseScheduleController');  
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /course-schedule:
 *   get:
 *     summary: Mendapatkan jadwal kuliah berdasarkan hari
 *     tags: [Course Schedules]  
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Jadwal kuliah berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jadwal kuliah berhasil diambil."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: objectId
 *                         example: "60d5ec49f1a2c8b1f8e4e1a1"
 *                       day:
 *                         type: string
 *                         example: "Senin"
 *                       schedules:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               format: objectId
 *                               example: "679a37d3958244fa6cfa2c87"
 *                             subject:
 *                               type: string
 *                               example: "Kimia"
 *                             start_time:
 *                               type: string
 *                               example: "13:00"
 *                             end_time:
 *                               type: string
 *                               example: "15:00"
 *                             location:
 *                               type: string
 *                               example: "Ruang C"
 *                             user_id:
 *                               type: string
 *                               format: objectId
 *                               example: "6773c14056bce40746399898"
 *       404:
 *         description: Tidak ada jadwal kuliah ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
router.get('/', authenticate, getCourseSchedulesByDay)
/**
 * @swagger
 * /course-schedule/day/{dayId}:
 *   get:
 *     summary: Mendapatkan semua jadwal kuliah berdasarkan ID hari
 *     tags: [Course Schedules]  
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         description: ID hari untuk mengambil jadwal kuliah.
 *         schema:
 *           type: string
 *           format: objectId
 *           example: "60d5ec49f1a2c8b1f8e4e1a1"
 *     responses:
 *       200:
 *         description: Jadwal kuliah berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jadwal kuliah berhasil diambil."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: objectId
 *                         example: "679a37d3958244fa6cfa2c87"
 *                       subject:
 *                         type: string
 *                         example: "Kimia"
 *                       start_time:
 *                         type: string
 *                         example: "13:00"
 *                       end_time:
 *                         type: string
 *                         example: "15:00"
 *                       location:
 *                         type: string
 *                         example: "Ruang C"
 *                       user_id:
 *                         type: string
 *                         format: objectId
 *                         example: "6773c14056bce40746399898"
 *       404:
 *         description: Tidak ada jadwal kuliah ditemukan untuk hari ini.
 *       500:
 *         description: Kesalahan server.
 */
router.get('/day/:dayId', authenticate, getCourseSchedulesByDayId)
/**
 * @swagger
 * /course-schedule/{id}:  
 *   get:  
 *     summary: Mendapatkan jadwal kuliah berdasarkan ID  
 *     tags: [Course Schedules]  
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         description: ID jadwal kuliah yang ingin diambil.
 *         schema:
 *           type: string
 *           format: objectId
 *           example: "679a37d3958244fa6cfa2c87"
 *     responses:
 *       200:
 *         description: Jadwal kuliah berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jadwal kuliah berhasil diambil."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: objectId
 *                       example: "679a37d3958244fa6cfa2c87"
 *                     subject:
 *                       type: string
 *                       example: "Kimia"
 *                     start_time:
 *                       type: string
 *                       example: "13:00"
 *                     end_time:
 *                       type: string
 *                       example: "15:00"
 *                     location:
 *                       type: string
 *                       example: "Ruang C"
 *                     user_id:
 *                       type: string
 *                       format: objectId
 *                       example: "6773c14056bce40746399898"
 *                     day_id:
 *                       type: string
 *                       format: objectId
 *                       example: "60d5ec49f1a2c8b1f8e4e1a1"
 *                     day_name:
 *                       type: string
 *                       example: "Senin"
 *       404:
 *         description: Jadwal kuliah tidak ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
router.get('/:scheduleId', authenticate, getCourseScheduleById)
/**
 * @swagger
 * /course-schedule:  
 *   post:
 *     summary: Menambahkan jadwal kuliah
 *     tags: [Course Schedules]  
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day_id:
 *                 type: string
 *                 format: objectId
 *                 example: "60d5ec49f1a2c8b1f8e4e1a1"
 *               subject:
 *                 type: string
 *                 example: "Kimia"
 *               start_time:
 *                 type: string
 *                 example: "13:00"
 *               end_time:
 *                 type: string
 *                 example: "15:00"
 *               location:
 *                 type: string
 *                 example: "Ruang C"
 *     responses:
 *       201:
 *         description: Jadwal kuliah berhasil ditambahkan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jadwal kuliah berhasil ditambahkan."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: objectId
 *                       example: "679a37d3958244fa6cfa2c87"
 *                     subject:
 *                       type: string
 *                       example: "Kimia"
 *                     start_time:
 *                       type: string
 *                       example: "13:00"
 *                     end_time:
 *                       type: string
 *                       example: "15:00"
 *                     location:
 *                       type: string
 *                       example: "Ruang C"
 *                     user_id:
 *                       type: string
 *                       format: objectId
 *                       example: "6773c14056bce40746399898"
 *       400:
 *         description: Semua field harus diisi.
 *       500:
 *         description: Kesalahan server.
 */
router.post('/', authenticate, addCourseSchedule)
/**
 * @swagger
 * /course-schedule/day/{dayId}/multiple:
 *   put:
 *     summary: Mengupdate beberapa jadwal kuliah berdasarkan ID hari
 *     tags: [Course Schedules]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         description: ID hari untuk mengupdate jadwal kuliah.
 *         schema:
 *           type: string
 *           format: objectId
 *           example: "60d5ec49f1a2c8b1f8e4e1a1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: objectId
 *                       example: "679b963e4fac69ea02de6607"
 *                     subject:
 *                       type: string
 *                       example: "Matematika"
 *                     start_time:
 *                       type: string
 *                       example: "10:00"
 *                     end_time:
 *                       type: string
 *                       example: "12:00"
 *                     location:
 *                       type: string
 *                       example: "Ruang 4.18 B"
 *     responses:
 *       200:
 *         description: Jadwal kuliah berhasil diperbarui.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jadwal kuliah berhasil diperbarui."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: objectId
 *                         example: "679b963e4fac69ea02de6607"
 *                       subject:
 *                         type: string
 *                         example: "Matematika"
 *                       start_time:
 *                         type: string
 *                         example: "10:00"
 *                       end_time:
 *                         type: string
 *                         example: "12:00"
 *                       location:
 *                         type: string
 *                         example: "Ruang 4.18 B"
 *                       user_id:
 *                         type: string
 *                         format: objectId
 *                         example: "6773c14056bce40746399898"
 *       400:
 *         description: Array jadwal tidak valid.
 *       404:
 *         description: Tidak ada jadwal kuliah ditemukan untuk diperbarui.
 *       500:
 *         description: Kesalahan server.
 */
router.put('/day/:dayId/multiple', authenticate, updateCourseSchedulesByDayId)
/**  
 * @swagger  
 * /course-schedule/{id}:  
 *   put:  
 *     summary: Mengedit jadwal kuliah berdasarkan ID  
 *     tags: [Course Schedules]  
 *     security:
 *       - BearerAuth: []
 *     parameters:  
 *       - in: path  
 *         name: id  
 *         required: true  
 *         description: ID dari jadwal kuliah yang ingin diedit  
 *         schema:  
 *           type: string  
 *           format: objectId  
 *           example: 60d5ec49f1a2c8b1f8e4e1a1  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               day:  
 *                 type: string  
 *                 example: Senin  
 *               subject:  
 *                 type: string  
 *                 example: Matematika  
 *               start_time:  
 *                 type: string  
 *                 example: 10:00 
 *               end_time: 
 *                 type: string
 *                 example: 12:00  
 *               location:  
 *                 type: string  
 *                 example: Ruang A  
 *     responses:  
 *       200:  
 *         description: Jadwal kuliah berhasil diperbarui.  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   example: Jadwal kuliah berhasil diperbarui.  
 *                 data:  
 *                   type: object  
 *                   properties:  
 *                     day:  
 *                       type: string  
 *                       example: Senin  
 *                     subject:  
 *                       type: string  
 *                       example: Matematika  
 *                     start_time:  
 *                       type: string  
 *                       example: 10:00 
 *                     end_time: 
 *                       type: string
 *                       example: 12:00  
 *                     location:  
 *                       type: string  
 *                       example: Ruang A  
 *                     user_id:  
 *                       type: string  
 *                       format: objectId  
 *                       example: 60d5ec49f1a2c8b1f8e4e1a1  
 *       404:  
 *         description: Jadwal kuliah tidak ditemukan.  
 *       500:  
 *         description: Kesalahan server.  
 */  
router.put('/:id', authenticate, updateCourseScheduleById)
/**  
 * @swagger  
 * /course-schedule/{id}:  
 *   delete:  
 *     summary: Menghapus jadwal kuliah berdasarkan ID  
 *     tags: [Course Schedules]  
 *     security:
 *       - BearerAuth: []
 *     parameters:  
 *       - in: path  
 *         name: id  
 *         required: true  
 *         description: ID dari jadwal kuliah yang ingin dihapus  
 *         schema:  
 *           type: string  
 *           format: objectId  
 *           example: 60d5ec49f1a2c8b1f8e4e1a1  
 *     responses:  
 *       200:  
 *         description: Jadwal kuliah berhasil dihapus.  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   example: Jadwal kuliah berhasil dihapus.  
 *                 data:  
 *                   type: object  
 *                   properties:  
 *                     _id:  
 *                       type: string  
 *                       format: objectId  
 *                       example: 60d5ec49f1a2c8b1f8e4e1a1  
 *                     day:  
 *                       type: string  
 *                       example: Senin  
 *                     subject:  
 *                       type: string  
 *                       example: Matematika  
 *                     start_time:  
 *                       type: string  
 *                       example: 10:00 
 *                     end_time: 
 *                       type: string
 *                       example: 12:00  
 *                     location:  
 *                       type: string  
 *                       example: Ruang A  
 *                     user_id:  
 *                       type: string  
 *                       format: objectId  
 *                       example: 60d5ec49f1a2c8b1f8e4e1a1  
 *       404:  
 *         description: Jadwal kuliah tidak ditemukan.  
 *       500:  
 *         description: Kesalahan server.  
 */  
router.delete('/:id', authenticate, deleteCourseSchedule)

module.exports = router;