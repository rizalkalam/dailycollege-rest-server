const express = require('express');
const { verifyEmail, verifyCode, newPassword, sendConfirmationEmail } = require('../controllers/forgotPasswordController');
const router = express.Router();

router.post('/verify_email', verifyEmail);
router.post('/verify_code', verifyCode);
router.post('/new_password', newPassword);
router.get('/confirm_email', sendConfirmationEmail);

module.exports = router;