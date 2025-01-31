const express = require('express');
const router = express.Router();
const { createTask, editTask, deleteTask, getTasks, getTaskById } = require('../controllers/taskController'); // Ganti dengan path yang sesuai
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Membuat tugas baru
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               detail:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Tugas berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     detail:
 *                       type: string
 *                     status:
 *                       type: string
 *                     priority:
 *                       type: string
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Semua input data harus diisi.
 *       500:
 *         description: Kesalahan server.
 */
router.post('/', authenticate, createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Mengedit tugas berdasarkan ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID tugas yang ingin diedit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               detail:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Tugas berhasil diperbarui.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     detail:
 *                       type: string
 *                     status:
 *                       type: string
 *                     priority:
 *                       type: string
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Semua input data harus diisi.
 *       404:
 *         description: Tugas tidak ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
router.put('/:id', authenticate, editTask); // Menggunakan metode PUT untuk mengedit

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Menghapus tugas berdasarkan ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID tugas yang ingin dihapus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tugas berhasil dihapus.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     detail:
 *                       type: string
 *                     status:
 *                       type: string
 *                     priority:
 *                       type: string
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Tugas tidak ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
router.delete('/:id', authenticate, deleteTask); // Menggunakan metode DELETE untuk menghapus

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Mendapatkan semua tugas
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar tugas berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   detail:
 *                     type: string
 *                   status:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   deadline:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Kesalahan server.
 */
router.get('/', authenticate, getTasks); // Menggunakan metode GET untuk mendapatkan semua tugas

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Mendapatkan tugas berdasarkan ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID tugas yang ingin diambil
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tugas berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 detail:
 *                   type: string
 *                 status:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Tugas tidak ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
router.get('/:id', authenticate, getTaskById); // Menggunakan metode GET untuk mendapatkan tugas berdasarkan ID

module.exports = router;