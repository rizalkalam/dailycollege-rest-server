const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
const { getUser } = require('../controllers/userController')

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Mengambil data pengguna
 *     description: Mengambil data pengguna yang terverifikasi menggunakan token JWT.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Data pengguna berhasil diambil'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '60d1b2f4b9d34a2345b0d1e2'
 *                     username:
 *                       type: string
 *                       example: 'johndoe'
 *                     email:
 *                       type: string
 *                       example: 'johndoe@example.com'
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       403:
 *         description: Pengguna tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil data pengguna
 */
router.get('/', authenticate, getUser)

module.exports = router;