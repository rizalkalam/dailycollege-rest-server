const express = require('express');  
const router = express.Router(); 
const { getCourseSchedulesByDay, getCourseScheduleById, addCourseSchedule, updateCourseScheduleById, deleteCourseSchedule } = require('../controllers/courseScheduleController');  
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
 *                   example: Jadwal kuliah berhasil diambil.  
 *                 data:  
 *                   type: array  
 *                   items:  
 *                     type: object  
 *                     additionalProperties:  
 *                       type: array  
 *                       items:  
 *                         type: object  
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "6794de36116a41544bb38098"  
 *                           subject:  
 *                             type: string  
 *                             example: Fisika  
 *                           start_time:  
 *                             type: string  
 *                             example: 10:00 
 *                           end_time: 
 *                             type: string
 *                             example: 12:00  
 *                           location:  
 *                             type: string  
 *                             example: Ruang B  
 *       500:  
 *         description: Kesalahan server.  
 */ 
router.get('/', authenticate, getCourseSchedulesByDay)
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
 *         name: id  
 *         required: true  
 *         description: ID dari jadwal kuliah yang ingin diambil  
 *         schema:  
 *           type: string  
 *           format: objectId  
 *           example: 60d5ec49f1a2c8b1f8e4e1a1  
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
 *                   example: Jadwal kuliah berhasil diambil.  
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
 *                      start_time:  
 *                        type: string  
 *                        example: 10:00 
 *                      end_time: 
 *                        type: string
 *                        example: 12:00  
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
router.get('/:id', authenticate, getCourseScheduleById)
/**  
 * @swagger  
 * /course-schedule:  
 *   post:  
 *     summary: Menambahkan jadwal kuliah baru  
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
 *               user_id:  
 *                 type: string  
 *                 format: objectId  
 *                 example: 60d5ec49f1a2c8b1f8e4e1a1  
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
 *                   example: Jadwal kuliah berhasil ditambahkan.  
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
 *       400:  
 *         description: Permintaan tidak valid.  
 *       500:  
 *         description: Kesalahan server.  
 */  
router.post('/', authenticate, addCourseSchedule)
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