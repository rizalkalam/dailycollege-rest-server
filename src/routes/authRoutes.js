const express = require('express');
const { login, register, verifyAndRegisterUser, resendVerificationCode} = require('../controllers/authController');
const passport = require('passport');
const router = express.Router();

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
 *     summary: Login user
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
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', login);

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
router.get('/google', (req, res)=>{
    const googleAuthURL = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=https%3A%2F%2Fdailycollege.testingfothink.my.id%2Fauth%2Fgoogle%2Fcallback&scope=profile%20email&client_id=46915514212-r1sb41g5ghf2vc2bi0paseiq94n74frj.apps.googleusercontent.com&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow'
    res.redirect(googleAuthURL)
})

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
                redirectTo: 'https://dailycollege.vercel.app/login',
                isNewUser: true
            });
        } else {
            return res.status(200).json({
                message: 'Akun anda sudah terdaftar!',
                redirectTo: 'https://dailycollege.vercel.app/login',  // URL untuk redirect
                isNewUser: false
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