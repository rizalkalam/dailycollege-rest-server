const express = require('express');
const { login, logout, get_token, register, verifyAndRegisterUser, resendVerificationCode} = require('../controllers/authController');
const passport = require('passport');
const router = express.Router();
const { generateToken } = require('../utils/jwt')
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register pengguna baru
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *                  description: Nama lengkap pengguna
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *               password:
 *                 type: string
 *                 description: Password pengguna yang aman
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/resend-verification-code:
 *   post:
 *     summary: Resend verification code
 *     description: Mengirim ulang kode verifikasi ke email pengguna.
 *     tags:
 *       - Authentication
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
 *                 example: user@example.com
 *                 description: Email pengguna yang terdaftar.
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Kode verifikasi berhasil dikirim ulang.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A new verification code has been sent. Please check your inbox.
 *       400:
 *         description: Permintaan tidak valid atau email tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data not found. Please register first.
 *       500:
 *         description: Terjadi kesalahan saat mengirim ulang kode verifikasi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to resend verification code. Please try again later.
 */
router.post('/resend-verification-code', resendVerificationCode);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify the user's email with the verification code.
 *     description: This endpoint verifies the user's email and registers them if the code is correct.
 *     operationId: verifyUser
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The verification code to verify the user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationCode
 *             properties:
 *               verificationCode:
 *                 type: number
 *                 example: '12345'
 *     responses:
 *       200:
 *         description: User verified and registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: Invalid verification code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid verification code
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/verify', verifyAndRegisterUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticate user and return a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: adesetiawan@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login berhasil, silakan ambil token.
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/get-token:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Mendapatkan token JWT berdasarkan session
 *     description: Mengambil token JWT berdasarkan session yang valid. Memerlukan sessionId yang disimpan dalam cookie.
 *     responses:
 *       200:
 *         description: Token berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token berhasil diambil
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Session tidak ditemukan atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan saat mengambil token
 */
router.get('/get-token', get_token)

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Invalidate JWT token untuk user tertentu
 *     security:
 *       - BearerAuth: []
  *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout berhasil
 *       400:
 *         description: Token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kesalahan server saat logout
 */
router.get('/logout', authenticate, logout)

// Initiates the Google OAuth 2.0 authentication flow
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: "Start Google OAuth authentication"
 *     tags: [Authentication]
 *     description: "Initiates authentication with Google OAuth"
 *     responses:
 *       200:
 *         description: "Redirects to Google OAuth login"
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: "Google OAuth callback"
 *     tags: [Authentication]
 *     description: "Handles the callback after Google authentication."
 *     responses:
 *       200:
 *         description: "Returns user information and JWT token"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Login or Registration successful'
 *                 user:
 *                   type: object
 *                   properties:
 *                     googleId:
 *                       type: string
 *                       example: '1234567890'
 *                     displayName:
 *                       type: string
 *                       example: 'John Doe'
 *                     email:
 *                       type: string
 *                       example: 'john.doe@gmail.com'
 *                     avatar:
 *                       type: string
 *                       example: 'https://google.com/avatar.jpg'
 *                 token:
 *                   type: string
 *                   example: 'jwt-token-here'
 *       400:
 *         description: "Error in authentication"
 */
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
    try {
        const { user } = req;  // Ambil user dari request

        const accessToken = generateToken(user._id);

        // Kirimkan token dalam respons
        if (user.isNew) {
            return res.status(200).json({
                message: 'Anda berhasil mendaftar!',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    googleId: user.googleId
                },
                isNewUser: true,
                redirectTo: 'https://dailycollege.vercel.app/',
                token: accessToken
            });
        } else {
            return res.status(200).json({
                message: 'Akun anda sudah terdaftar!',
                isNewUser: false,
                redirectTo: 'https://dailycollege.vercel.app/',  // URL untuk redirect
                token: accessToken
            });
        }

    } catch (err) {
        console.error('Error during callback handling:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message || err
        })
    }
});


module.exports = router;