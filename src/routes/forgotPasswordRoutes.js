const express = require('express');
const { verifyEmail, verifyCode, newPassword, sendConfirmationEmail } = require('../controllers/forgotPasswordController');
const router = express.Router();

/**
 * @swagger
 * /verify_email:
 *   post:
 *     summary: Verifikasi Email
 *     tags: [Forgot Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Alamat email pengguna
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Email berhasil diverifikasi
 *       400:
 *         description: Permintaan tidak valid
 */
router.post('/verify_email', verifyEmail);
/**
 * @swagger
 * /verify_code:
 *   post:
 *     summary: Verifikasi Kode
 *     tags: [Forgot Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 description: Kode verifikasi
 *             required:
 *               - verificationCode
 *     responses:
 *       200:
 *         description: Kode verifikasi valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification code is valid.
 *       400:
 *         description: Kode verifikasi tidak valid atau data sesi hilang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid verification code.
 */
router.post('/verify_code', verifyCode);
/**
 * @swagger
 * /new_password:
 *   post:
 *     summary: Buat Password Baru
 *     tags: [Forgot Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Password baru pengguna
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Konfirmasi password baru
 *             required:
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       200:
 *         description: Password berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Permintaan tidak valid (password tidak cocok atau kode verifikasi diperlukan)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password and confirm password do not match
 *       404:
 *         description: Pengguna tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Kesalahan server
 */
router.post('/new_password', newPassword);
// ---
router.get('/confirm_email', sendConfirmationEmail);

module.exports = router;