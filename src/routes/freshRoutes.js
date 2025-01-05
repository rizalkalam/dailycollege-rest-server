const { exec } = require('child_process');
const express = require('express');
const router = express.Router();

// Middleware untuk memverifikasi API Key
const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Ambil API Key dari header

    if (!apiKey || apiKey !== 'dailycollege-server0102') { // Ganti dengan API Key yang valid
        return res.status(403).json({
            message: 'Forbidden: Invalid or missing API key.',
        });
    }

    next(); // Jika API Key valid, lanjutkan ke endpoint
};

/**
 * @swagger
 * /fresh/seed/all:
 *   get:
 *     summary: Seed users and schedules
 *     description: This endpoint will execute seeding of users and schedules using npm scripts.
 *     tags:
 *       - Fresh_DB
 *     security:
 *       - ApiKeyAuth: []  # Membutuhkan API Key untuk akses
 *     responses:
 *       200:
 *         description: Successfully seeded users and schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users and schedules seeded successfully!
 *                 output:
 *                   type: string
 *                   example: 'Output of the seed scripts'
 *       500:
 *         description: Error executing seeding scripts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error executing seeding scripts
 *                 error:
 *                   type: string
 *                   example: 'stderr or error message'
 */
router.get('/seed/all', verifyApiKey, (req, res) => {
    exec('npm run seed:schedules && npm run seed:tasks', (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({
                message: 'Error executing seeding scripts',
                error: stderr || err.message
            });
        }
        res.status(200).json({
            message: 'DB seeded successfully!',
            output: stdout
        });
    });
})

module.exports = router;