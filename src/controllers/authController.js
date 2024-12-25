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
    const { email } = req.body; // Email yang akan digunakan untuk mengirim ulang kode

    try {
        // Periksa apakah email valid
        await verifyEmail(email);

        // Cari data pengguna berdasarkan email
        const keys = await redisClient.keys('userData:*');
        const matchingKey = keys.find(async (key) => {
            const userDataString = await redisClient.get(key);
            const userData = JSON.parse(userDataString || '{}');
            return userData.email === email;
        });

        if (!matchingKey) {
            return res.status(400).json({ message: 'User data not found. Please register first.' });
        }

        // Ambil data pengguna dari Redis
        const userDataString = await redisClient.get(matchingKey);
        const userData = JSON.parse(userDataString);

        // Buat kode verifikasi baru
        const newVerificationCode = Math.floor(10000 + Math.random() * 90000);

        // Update data pengguna dengan kode verifikasi baru
        userData.verificationCode = newVerificationCode;

        // Hapus key lama
        await redisClient.del(matchingKey);

        // Buat key baru sesuai kode verifikasi baru
        const newKey = `userData:${newVerificationCode}`;
        await redisClient.setex(newKey, 300, JSON.stringify(userData));

        // Kirim ulang email verifikasi
        await sendVerificationEmail(email, newVerificationCode);

        return res.status(200).json({ message: 'A new verification code has been sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error resending verification code:', error.message);
        return res.status(500).json({ message: 'Failed to resend verification code. Please try again later.' });
    }
};

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
        await verifyEmail(email);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered. Please use another email.' });
        }

        let googleId = null;

        // Hash password jika menggunakan email/password
        const hashedPassword = googleToken ? null : await bcrypt.hash(password, 10);

        // Jika menggunakan email/password, kirim kode verifikasi ke email
        const verificationCode = Math.floor(10000 + Math.random() * 90000);

        // Simpan data pengguna ke Redis dengan key yang unik (email)
        const userData = {
            email,
            name,
            hashedPassword,
            googleId: googleId || null,
            verificationCode: verificationCode // Tambahkan kode verifikasi
        };

        // Simpan data pengguna ke Redis (dengan TTL 10 menit)
        await redisClient.setex(`userData:${verificationCode}`, 300, JSON.stringify(userData));

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
        // Ambil semua data pengguna dari Redis menggunakan kode verifikasi
        const keys = await redisClient.keys('userData:*'); // Ambil semua key yang cocok
        let userData = null;

        for (const key of keys) {
            const dataString = await redisClient.get(key);
            const data = dataString ? JSON.parse(dataString) : null;

            if (data && parseInt(data.verificationCode) === parseInt(verificationCode)) {
                userData = data;
                break;
            }
        }

        if (!userData) {
            return res.status(400).json({ message: 'Verification code invalid or expired' });
        }

        // Simpan data ke MongoDB setelah verifikasi berhasil
        const newUser = new User({
            email: userData.email,
            name: userData.name,
            hashedPassword: userData.hashedPassword,
            googleId: userData.googleId || null,
            verified: true // Tandai sebagai sudah terverifikasi
        });

        await newUser.save();

        // Hapus data pengguna dari Redis setelah berhasil disimpan
        await redisClient.del(`userData:${verificationCode}`);

        return res.status(200).json({ message: 'Verification successful and user registered', user: newUser });
    } catch (error) {
        console.error('Error verifying code:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateToken(user._id);

    res.json({ token: accessToken });
};

module.exports = { login, register, verifyAndRegisterUser, resendVerificationCode};