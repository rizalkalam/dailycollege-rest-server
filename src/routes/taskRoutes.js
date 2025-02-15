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
 *     summary: Mendapatkan daftar tugas
 *     description: Endpoint untuk mengambil daftar tugas dengan filter status dan priority
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: "belum_selesai"
 *         description: Filter berdasarkan tugas yang belum selesai
 *         required: false
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [rendah, sedang, tinggi]
 *         description: Filter berdasarkan prioritas tugas
 *         required: false
 *     responses:
 *       200:
 *         description: Daftar tugas berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Daftar tugas berhasil diambil."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID unik tugas
 *                         example: "60d5ec49f1a2c8b1f8e4e1a1"
 *                       name:
 *                         type: string
 *                         description: Nama tugas
 *                         example: "Tugas Matematika"
 *                       detail:
 *                         type: string
 *                         description: Detail tugas
 *                         example: "Mengerjakan soal halaman 23"
 *                       status:
 *                         type: string
 *                         description: Status tugas
 *                         enum: [aktif, pending, selesai]
 *                         example: "aktif"
 *                       priority:
 *                         type: string
 *                         description: Prioritas tugas
 *                         enum: [rendah, sedang, tinggi]
 *                         example: "tinggi"
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                         description: Deadline tugas
 *                         example: "2025-02-01T12:00:00Z"
 *       400:
 *         description: Parameter tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Priority harus rendah, sedang, atau tinggi"
 *       401:
 *         description: Token tidak valid atau tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: Token tidak valid"
 *       404:
 *         description: Tidak ada tugas ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tidak ada tugas ditemukan."
 *       500:
 *         description: Kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kesalahan server."
 * 
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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