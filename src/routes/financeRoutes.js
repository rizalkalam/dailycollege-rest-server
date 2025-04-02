const express = require('express');  
const router = express.Router();  
const { getFinance, addFinancialRecord, getHistory } = require('../controllers/financeController');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /finance/summary:
 *   get:
 *     summary: Mendapatkan ringkasan keuangan
 *     description: |
 *       Mengambil total pemasukan, pengeluaran, dan selisih untuk pengguna yang terautentikasi.
 *       
 *       Penjelasan:
 *       - totalIncome: Untuk mencatat pemasukan/uang masuk
 *       - totalExpense: Untuk mencatat pengeluaran/uang keluar
 *       - difference: Untuk selisih
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

/**
 * @swagger
 * /finance:
 *   post:
 *     summary: Menambahkan catatan keuangan baru
 *     description: |
 *       Endpoint untuk membuat catatan keuangan baru untuk pengguna yang terautentikasi.
 *       
 *       Penjelasan Type Transaksi:
 *       - income: Untuk mencatat pemasukan/uang masuk
 *       - expense: Untuk mencatat pengeluaran/uang keluar
 *       
 *       Penjelasan Kategori berdasarkan Type:
 *       - Untuk Type : Uang Masuk, Belanja, Topup, Lainnya
 *     tags: [Finance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - category
 *               - type
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Jumlah transaksi (harus lebih dari 0)
 *                 example: 50000
 *               category:
 *                 type: string
 *                 enum: [Uang Masuk, Belanja, Topup, Lainnya]
 *                 description: |
 *                   Kategori transaksi:
 *                   - Uang Masuk: Untuk pemasukan seperti gaji, bonus, dll
 *                   - Belanja: Untuk pengeluaran pembelian barang/jasa
 *                   - Topup: Untuk pemasukan/pengeluaran terkait pengisian saldo
 *                   - Lainnya: Untuk transaksi yang tidak masuk kategori di atas
 *                 example: "Uang Masuk"
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 description: |
 *                   Tipe transaksi:
 *                   - income: Untuk mencatat pemasukan/uang masuk
 *                   - expense: Untuk mencatat pengeluaran/uang keluar
 *                 example: "income"
 *               detail:
 *                 type: string
 *                 description: Detail tambahan transaksi (opsional)
 *                 example: "Gaji bulanan"
 *           examples:
 *             income_salary:
 *               summary: Contoh pemasukan gaji
 *               value:
 *                 amount: 5000000
 *                 category: "Uang Masuk"
 *                 type: "income"
 *                 detail: "Gaji bulan Februari"
 *             expense_shopping:
 *               summary: Contoh pengeluaran belanja
 *               value:
 *                 amount: 150000
 *                 category: "Belanja"
 *                 type: "expense"
 *                 detail: "Belanja bulanan di supermarket"
 *             topup_ewallet:
 *               summary: Contoh topup e-wallet
 *               value:
 *                 amount: 100000
 *                 category: "Topup"
 *                 type: "expense"
 *                 detail: "Topup OVO"
 *             other_expense:
 *               summary: Contoh pengeluaran lainnya
 *               value:
 *                 amount: 50000
 *                 category: "Lainnya"
 *                 type: "expense"
 *                 detail: "Parkir bulanan"
 *     responses:
 *       201:
 *         description: Data transaksi berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Data transaksi berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     category:
 *                       type: string
 *                       example: "Uang Masuk"
 *                     type:
 *                       type: string
 *                       example: "income"
 *                     detail:
 *                       type: string
 *                       example: "Gaji bulanan"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-19T10:00:00.000Z"
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Data tidak lengkap. Amount, category, dan type wajib diisi"
 *                 data:
 *                   type: null
 *                   example: null
 *       401:
 *         description: Token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token tidak ditemukan"
 *                 data:
 *                   type: null
 *                   example: null
 *       403:
 *         description: Token tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid"
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.post('/', authenticate, addFinancialRecord)

/**
 * @swagger
 * /finance/history:
 *   get:
 *     summary: Mendapatkan riwayat transaksi keuangan
 *     description: |
 *       Endpoint untuk mendapatkan riwayat transaksi keuangan dengan filter kategori dan bulan.
 *       - Filter berdasarkan kategori transaksi
 *       - Filter berdasarkan bulan dan tahun
 *       - Dilengkapi dengan pagination untuk optimasi performa
 *     tags: [Finance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Uang Masuk, Belanja, Topup, Lainnya]
 *         description: Filter berdasarkan kategori (opsional)
 *         example: Belanja
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Filter berdasarkan bulan (format YYYY-MM)
 *         example: "2024-02"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *         description: Jumlah data per halaman
 *         example: 20
 *     responses:
 *       200:
 *         description: Data riwayat transaksi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Data riwayat transaksi berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "507f1f77bcf86cd799439011"
 *                           user_id:
 *                             type: string
 *                             example: "507f1f77bcf86cd799439012"
 *                           amount:
 *                             type: number
 *                             example: 50000
 *                           category:
 *                             type: string
 *                             example: "Belanja"
 *                           type:
 *                             type: string
 *                             enum: [income, expense]
 *                             example: "expense"
 *                           detail:
 *                             type: string
 *                             example: "Belanja bulanan"
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-02-19T10:00:00.000Z"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         totalData:
 *                           type: integer
 *                           example: 100
 *                         limit:
 *                           type: integer
 *                           example: 20
 *       401:
 *         description: Token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token tidak ditemukan"
 *                 data:
 *                   type: null
 *                   example: null
 *       403:
 *         description: Token tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid"
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Terjadi kesalahan saat mengambil data riwayat transaksi"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/history', authenticate, getHistory)

module.exports = router;  