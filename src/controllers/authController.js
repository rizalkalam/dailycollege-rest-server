const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Mengimpor jsonwebtoken
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { generateToken, revokeToken } = require('../utils/jwt')
const emailValidator = require('email-validator');
const redisClient = require('../config/redisClient')
const profile = require("nodemailer/lib/smtp-connection");
const { v4: uuidv4 } = require('uuid');

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
            return res.status(400).json({ message: 'Data pengguna tidak ditemukan. Daftar akun terlebih dahulu' });
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
        await redisClient.setex(newKey, 120, JSON.stringify(userData));

        // Kirim ulang email verifikasi
        await sendVerificationEmail(email, newVerificationCode);

        return res.status(200).json({ message: 'A new verification code has been sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error resending verification code:', error.message);
        return res.status(500).json({ message: 'Gagal mengirim kode verifikasi. Mohon ulangi lagi nanti' });
    }
};

// Fungsi untuk memverifikasi email dan memeriksa apakah Gmail
const verifyEmail = async (email) => {
    try {
        // Cek apakah email valid dengan regex
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            throw new Error('Format email anda tidak valid');
        }

        // Cek apakah email adalah Gmail
        const isGmail = email.endsWith('@gmail.com');
        if (!isGmail) {
            throw new Error('Email harus gmail');
        }

        if (!emailValidator.validate(email)) {
            throw new Error('Format email tidak valid');
        }

    } catch (error) {
        throw new Error(error.message || 'Verifikasi email gagal');
    }
};

const register = async (req, res) => {
    const { name, email, password, googleToken } = req.body;

    try {
        await verifyEmail(email);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email anda sudah terdaftar' });
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

        // Simpan data pengguna ke Redis (dengan TTL 2 menit)
        await redisClient.setex(`userData:${verificationCode}`, 120, JSON.stringify(userData));

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
            return res.status(400).json({ message: 'Kode verifikasi anda salah/expired' });
        }

        // Simpan data ke MongoDB setelah verifikasi berhasil
        const newUser = new User({
            email: userData.email,
            name: userData.name,
            password: userData.hashedPassword,
            googleId: userData.googleId || null,
            verified: true // Tandai sebagai sudah terverifikasi
        });

        await newUser.save();

        // Hapus data pengguna dari Redis setelah berhasil disimpan
        await redisClient.del(`userData:${verificationCode}`);

        return res.status(200).json({ message: 'Verifikasi sukses data berhasil terdaftar' });
    } catch (error) {
        console.error('Error verifying code:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// redis auth systems
// Fungsi untuk menyimpan token sementara di Redis
const storeTemporaryToken = async (userId, token) => {
    const key = `temp_token:${userId}`;
    await redisClient.set(key, token, 'EX', 300); // Expired dalam 5 menit (300 detik)
};
// Fungsi untuk mengambil token dari Redis
const getTemporaryToken = async (userId) => {
    const key = `temp_token:${userId}`;
    return await redisClient.get(key);
};
// Fungsi untuk menghapus token dari Redis
const deleteTemporaryToken = async (userId) => {
    const key = `temp_token:${userId}`;
    await redisClient.del(key);
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi' });
        }

        // Cari user berdasarkan email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Kredensial tidak valid' });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Kredensial tidak valid' });
        }

        const token = await generateToken(user);

        // Generate session ID yang unik
        const sessionId = uuidv4();

        // Simpan data user dengan session ID di Redis
        const sessionData = {
            token: token,
            createdAt: new Date().toISOString()
        };

        // Simpan di Redis dengan format: session:{sessionId}
        await redisClient.set(
            `session:${sessionId}`, 
            JSON.stringify(sessionData), 
            'EX', 
            604800 // 7 hari dalam detik
        );

        // Set sessionId di cookie (HTTP-Only, Secure)
        res.cookie('sessionId', sessionId, {
            httpOnly: false, // Tidak bisa diakses via JavaScript
            secure: true,
            sameSite: "None", // Proteksi CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
            // secure: process.env.NODE_ENV === 'production', // Hanya dikirim via HTTPS di production
        });

        return res.status(200).json({ message: 'Login berhasil' });
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ message: 'Kesalahan server' });
    }
};

const get_token = async (req, res) => {
    try {
         // Ambil sessionId dari cookie
        const sessionId = req.cookies.sessionId;
        if (!sessionId) {
            return res.status(401).json({ message: 'Session tidak ditemukan' });
        }

        // Ambil session data dari Redis
        const sessionData = await redisClient.get(`session:${sessionId}`);
        if (!sessionData) {
            return res.status(401).json({ message: 'Session tidak valid atau kedaluwarsa' });
        }

        const { token, createdAt } = JSON.parse(sessionData);

        // Decode token untuk mendapatkan expiration time
        const decodedToken = jwt.decode(token);
        if (!decodedToken || !decodedToken.exp) {
            throw new Error('Invalid token structure');
        }

        // Konversi UNIX timestamp ke Date
        const expiresAt = new Date(decodedToken.exp * 1000);
        
        // Hitung waktu tersisa dalam detik
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = decodedToken.exp - now;

        return res.status(200).json({ 
            message: 'Token berhasil dibuat',
            token: token,
            expires_at: expiresAt.toISOString(),
            expires_in: expiresIn,
            expiration_info: {
                date: expiresAt.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: expiresAt.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                })
            }
        });
    } catch (error) {
        console.error('Error getting token:', error.message);
        return res.status(500).json({ 
            message: 'Kesalahan server saat mengambil token' 
        });
    }
};

const logout = async (req, res) => {
    try {
        const userId = req.user._id; // Ambil dari req.user
        const token = req.headers['authorization']?.replace('Bearer ', '');

        if (!token) {
            return res.status(400).json({ message: 'Token tidak ditemukan' });
        }

        await redisClient.del(`user:${userId}:${token}`);

        res.status(200).json({ message: 'Logout berhasil' });
    } catch (error) {
        console.error('Error during logout:', error.message);
        return res.status(500).json({ message: 'Kesalahan server saat logout' });
    }
};

module.exports = { login, logout, get_token, register, verifyAndRegisterUser, resendVerificationCode};