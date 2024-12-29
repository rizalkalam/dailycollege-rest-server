const express = require('express');
const { verifyEmail, resendVerifyEmail, verifyCode, newPassword, sendConfirmationEmail } = require('../controllers/forgotPasswordController');
const router = express.Router();

/**
 * @swagger
 * /forgot_password/verify_email:
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
 * /resend_verify_email:
 *   post:
 *     summary: Resend verification email
 *     description: Mengirimkan kode verifikasi baru ke email yang diberikan.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email pengguna yang akan dikirimkan kode verifikasi.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Kode verifikasi baru berhasil dikirim.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New verification code sent to your email. Please check your inbox."
 *       400:
 *         description: Terjadi kesalahan saat mengirimkan kode verifikasi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error resending verification email"
 *       404:
 *         description: Email tidak ditemukan atau tidak ada kode verifikasi terkait.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification code not found for the provided email"
 */
router.post('/resend_verify_email', resendVerifyEmail);
/**
 * @swagger
 * /forgot_password/verify_code:
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
 * /forgot_password/new_password:
 *   post:
 *     summary: Update password pengguna setelah verifikasi kode
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
 *                 description: Kode verifikasi yang diterima pengguna untuk mereset password
 *                 example: "1234"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Password baru pengguna
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Konfirmasi password baru
 *                 example: "newpassword123"
 *             required:
 *               - verificationCode
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
 *                   example: "Password updated successfully"
 *       400:
 *         description: Permintaan tidak valid (password tidak cocok atau kode verifikasi diperlukan)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password and confirm password do not match"
 *       404:
 *         description: Pengguna tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
router.post('/new_password', newPassword);
// ---
router.get('/confirm_email', sendConfirmationEmail);

module.exports = router;