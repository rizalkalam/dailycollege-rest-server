const express = require('express');  
const router = express.Router();  
const dayController = require('../controllers/dayController');  
const authenticate = require('../middlewares/authenticate');
  
/**
 * @swagger
 * /days:
 *   get:
 *     summary: Mendapatkan daftar hari
 *     tags: [Days]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar hari berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Daftar hari berhasil diambil."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: objectId
 *                         example: "60d5ec49f1a2c8b1f8e4e1a1"
 *                       name:
 *                         type: string
 *                         example: "Senin"
 *       500:
 *         description: Kesalahan server.
 */
router.get('/', authenticate, dayController.getDays);  
  
module.exports = router;  