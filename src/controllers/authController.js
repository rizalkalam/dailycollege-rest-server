const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Mengimpor jsonwebtoken
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { generateToken, generateRefreshToken, validateRefreshToken, revokeRefreshToken } = require('../utils/jwt')
const emailValidator = require('email-validator');
const redisClient = require('../config/redisClient')
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

// Fungsi untuk mengirimkan kode verifikasi
const sendVerificationCodeToRedis = async (userEmail, verificationCode, sessionId) => {
    // Menyimpan data ke Redis dengan sessionId sebagai key
    const key = `verification:${sessionId}`;

    // Simpan data userEmail dan verificationCode di Redis (bisa disesuaikan jika ingin menambahkan waktu kedaluwarsa)
    await redis.hmset(key, 'userEmail', userEmail, 'verificationCode', verificationCode);
    await redis.expire(key, 5 * 60);  // Set expiration time ke 5 menit (300 detik)
};


const register = async (req, res) => {
    const { name, email, password, googleToken } = req.body;

    try {
        await verifyEmail(email);

        let googleId = null;

        // Hash password jika menggunakan email/password
        const hashedPassword = googleToken ? null : await bcrypt.hash(password, 10);

        // Simpan data pengguna ke Redis dengan key yang unik (email)
        const userData = {
            email,
            name,
            hashedPassword,
            googleId: googleId || null
        };

        // Simpan data pengguna ke Redis (dengan TTL 10 menit)
        await redisClient.setex(`userData:${email}`, 600, JSON.stringify(userData));

        // Simpan email ke Redis (dengan TTL yang sama, untuk mengambil email saat verifikasi)
        await redisClient.setex(`userEmail:${email}`, 600, email);

        // Jika menggunakan email/password, kirim kode verifikasi ke email
        const verificationCode = Math.floor(10000 + Math.random() * 90000);

        // Simpan kode verifikasi ke Redis
        await redisClient.setex(`verificationCode:${email}`, 600, verificationCode);

        // Kirim email verifikasi
        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({ message: 'Verification code sent to your email. Please check your inbox.' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Fungsi untuk memverifikasi kode verifikasi yang dimasukkan pengguna
const verifyAndRegisterUser = async (req, res) => {
    const { verificationCode } = req.body;

    try {
        // Ambil semua keys yang cocok dengan pola userEmail:*
        const keys = await redisClient.keys('userEmail:*'); // Mengambil semua keys yang dimulai dengan userEmail:

        // Pastikan ada email yang ditemukan
        if (keys.length === 0) {
            return res.status(400).json({ message: 'No email found in Redis' });
        }

        // Ambil email terakhir berdasarkan key yang ditemukan
        const latestEmailKey = keys[keys.length - 1];  // Key terakhir
        const email = await redisClient.get(latestEmailKey);  // Ambil email berdasarkan key terakhir
        
        if (!email) {
            return res.status(400).json({ message: 'No email found in Redis' });
        }

        // Ambil data pengguna dari Redis
        const userDataString = await redisClient.get(`userData:${email}`);
        const userData = userDataString ? JSON.parse(userDataString) : null;

        if (!userData) {
            return res.status(400).json({ message: 'User data not found in Redis' });
        }

        // Ambil kode verifikasi yang disimpan di Redis
        const storedCode = await redisClient.get(`verificationCode:${email}`);
        
        if (!storedCode) {
            return res.status(400).json({ message: 'Verification code expired or invalid' });
        }

        // Verifikasi kode
        if (parseInt(storedCode) === parseInt(verificationCode)) {
            // Simpan data pengguna ke MongoDB
            const newUser = new User({
                email: userData.email,
                name: userData.name,
                hashedPassword: userData.hashedPassword,
                googleId: userData.googleId || null,
                verified: true  // Tandai sebagai sudah terverifikasi
            });

            // Simpan pengguna ke database MongoDB
            await newUser.save();

            // Hapus data terkait verifikasi di Redis setelah berhasil disimpan ke MongoDB
            await redisClient.del(latestEmailKey);
            await redisClient.del(`userData:${email}`);
            await redisClient.del(`verificationCode:${email}`);

            return res.status(200).json({ message: 'Verification successful and user registered', user: newUser });
        } else {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
    } catch (error) {
        console.error('Error verifying code:', error.message);
        res.status(400).json({ message: error.message });
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