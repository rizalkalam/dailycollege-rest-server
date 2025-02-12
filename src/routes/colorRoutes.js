const express = require('express');  
const router = express.Router();  
const colorController = require('../controllers/colorController');  
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * /colors:
 *   get:
 *     summary: Mendapatkan semua warna aksen
 *     description: Retrieve a list of all colors from the database.
 *     tags: [Colors Accents]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of colors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Colors retrieved successfully
 *                 colors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: objectId
 *                         example: "67ab16bdb1254b813e8f9634"
 *                       color_name:
 *                         type: string
 *                         example: Red
 *                       color_value:
 *                         type: string
 *                         example: "#FF0000"
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, colorController.getColors)

module.exports = router;  