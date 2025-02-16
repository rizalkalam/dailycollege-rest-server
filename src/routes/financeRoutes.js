const express = require('express');  
const router = express.Router();  
const { getFinance } = require('../controllers/financeController');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /finance/summary:
 *   get:
 *     summary: Mendapatkan ringkasan keuangan
 *     description: Mengambil total pemasukan, pengeluaran, dan selisih untuk pengguna yang terautentikasi.
 *     tags: [Finance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Ringkasan catatan keuangan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 1000
 *                     totalExpense:
 *                       type: number
 *                       example: 500
 *                     difference:
 *                       type: number
 *                       example: 500
 *       401:
 *         description: User ID tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User ID tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil data keuangan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan saat mengambil data keuangan
 */
router.get('/summary', authenticate, getFinance)

module.exports = router;  