const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Mengimpor jsonwebtoken
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { generateToken, generateRefreshToken, validateRefreshToken, revokeRefreshToken } = require('../utils/jwt')
const emailValidator = require('email-validator');
const profile = require("nodemailer/lib/smtp-connection");

// Fungsi untuk mengirimkan kode verifikasi ke email
const sendVerificationEmail = async (email, verificationCode, res) => {
    try {
        // Setup transporter untuk Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rizalkhoiru6@gmail.com',
                pass: 'gqcjyfkdyovmoyyf',
            },
        });

        // Email content
        const mailOptions = {
            from: 'Support Team <support@dailycollege.com>',
            to: email,
            subject: 'Email Verification Code',
            // text: `Your verification code is: ${verificationCode}`,
            html: `
                <html>
                    <body>
                        <h2>Thank you for registering! Welcome to Dailycollege</h2>
                        <p>Your verification code is: </p>
                        <h3>${verificationCode}</h3>
                        <br></br>
                        <p><strong>Dailycollege</strong></p>
                        
                        <hr>
                        <p style="font-size: 12px; color: gray;">
                            <strong>Note:</strong> This feature is still in development. If you encounter any issues, please contact our support team.
                        </p>                    
                    </body>
                </html>
            `,
        };

        // Kirim email
        await transporter.sendMail(mailOptions);
        console.log(`Verification code sent to ${email} : ${verificationCode}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

const resendVerificationCode = async (req, res) => {
    try {
        // Periksa apakah email ada di session
        if (!req.session.userData || !req.session.userData.email) {
            return res.status(400).json({ message: 'You must be logged in to request a new verification code.' });
        }

        const email = req.session.userData.email;

        // Verifikasi email format dan apakah email adalah Gmail
        await verifyEmail(email);

        // Dapatkan verificationCode dari session
        const verificationCode = req.session.verificationCode;

        if (!verificationCode) {
            return res.status(400).json({ message: 'No verification code found in session.' });
        }

        // Kirim ulang kode verifikasi ke email
        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({ message: 'Verification code has been resent. Please check your inbox.' });

    } catch (error) {
        console.error('Error resending verification code:', error.message);
        return res.status(400).json({ message: error.message });
    }
}

// Fungsi untuk memverifikasi email dan memeriksa apakah Gmail
const verifyEmail = async (email) => {
    try {
        // Cek apakah email valid dengan regex
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        // Cek apakah email adalah Gmail
        const isGmail = email.endsWith('@gmail.com');
        if (!isGmail) {
            throw new Error('Email must be a Gmail address');
        }

        if (!emailValidator.validate(email)) {
            throw new Error('Email format is invalid.');
        }

    } catch (error) {
        throw new Error(error.message || 'Error verifying email');
    }
};

const register = async (req, res) => {
    const { name, email, password, googleToken } = req.body;

    try {
        await verifyEmail(email)

        let googleId = null;

        // Hash password jika menggunakan email/password
        const hashedPassword = googleToken ? null : await bcrypt.hash(password, 10);

        // Simpan data pengguna ke session jika menggunakan Google Login
        req.session.userData = {
            email,
            name,
            hashedPassword,
            googleId: googleId || null
        };

        // Jika menggunakan email/password, kirim kode verifikasi ke email
        const verificationCode = Math.floor(10000 + Math.random() * 90000);

        req.session.verificationCode = verificationCode;
        await sendVerificationEmail(email, verificationCode);

        console.log('Session Data:', req.session);
        return res.status(200).json({ message: 'Verification code sent to your email. Please check your inbox.' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Fungsi untuk memverifikasi kode verifikasi yang dimasukkan pengguna
const verifyAndRegisterUser = async (req, res) => {
    const { verificationCode } = req.body;

    // Cek apakah kode verifikasi di session ada dan cocok
    if (verificationCode !== req.session.verificationCode) {
        console.log('Verification code mismatch or missing session data');
        return res.status(400).json({ message: 'Invalid verification code.' });
    }

    try {
        // Ambil data pengguna dari session
        const { email, name, hashedPassword, googleId  } = req.session.userData;

        // Simpan data pengguna ke database
        const newUser = new User({
            name,
            email,
            password: hashedPassword,  // hanya diisi jika menggunakan email/password
            googleId: googleId || null,  // Set googleId ke null jika tidak ada
        });
        await newUser.save();

        // Hapus data sementara setelah berhasil verifikasi
        req.session.destroy((err) => {
            if (err) console.error('Error destroying session:', err);
        });

        return res.status(200).json({
            message: 'User registered successfully.',
            user: { name: newUser.name, email: newUser.email, googleId: newUser.googleId },
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.cookie('refreshTokenId', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token: accessToken });
};

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshTokenId;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const userId = await validateRefreshToken(refreshToken);

        if (!userId) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const newAccessToken = generateToken(userId);
        res.json({ token: newAccessToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

module.exports = { login, register, verifyAndRegisterUser, resendVerificationCode, refreshToken};