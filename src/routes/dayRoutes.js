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
 *               type: array  
 *               items:  
 *                 type: string  
 *       500:  
 *         description: Kesalahan server.  
 */  
router.get('/', authenticate, dayController.getDays);  
  
module.exports = router;  