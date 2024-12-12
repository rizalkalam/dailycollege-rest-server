const express = require('express');
const { login, register, verifyAndRegisterUser} = require('../controllers/authController');
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
 *                 example: alice@example.com
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
        // Check if the user is new or an existing user
        const user = req.user;

        // If it's a new user, register the user
        if (user.isNew) {
            res.json({
                message: 'Registration successful!',
                status: 'success',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    googleId: user.googleId
                },
                isNewUser: true
            });
        } else {
            // If it's an existing user, log them in
            res.json({
                message: 'Login successful!',
                status: 'success',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    googleId: user.googleId
                },
                isNewUser: false
            });
        }
        // Optionally, redirect to another page after response
        // res.redirect('/');
    } catch (err) {
        // Handle any errors
        console.error(err);
        res.redirect('/login');
    }
});


module.exports = router;