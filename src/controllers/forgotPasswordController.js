const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const redisClient = require('../config/redisClient')

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
            html: `
                <html>
                    <body>
                        <h2>Welcome to Dailycollege</h2>
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

const sendConfirmationEmail = (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rizalkhoiru6@gmail.com',
            pass: 'gqcjyfkdyovmoyyf', // Pastikan Anda menggunakan kata sandi aplikasi yang benar
        }
    });

    const mailOptions = {
        from: 'Support Team <support@dailycollege.com>',
        to: email,
        subject: 'Reset Password Request',
        html: `
        <html>
                    <body>
                        <h2>Your password has been successfully changed</h2>
                        <p>Your password has been updated successfully. If you did not request this change, please contact support immediately.</p>
                        <br><br>
                        <p><strong>Thank you for using Dailycollege</strong></p>
                        
                        <hr>
                        <p style="font-size: 12px; color: gray;">
                            <strong>Note:</strong> This feature is still in development. If you encounter any issues, please contact our support team.
                        </p>                    
                    </body>

                </html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const verifyEmail = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({email})

        if (!user){
            return res.status(404).json({ message: 'Email not found' });
        }

        const verificationCode = Math.floor(1000 + Math.random() * 9000);

        // Simpan email dan kode verifikasi ke Redis
        const redisKey = `id_reset_passcode:${verificationCode}`;
        const redisData = {
            email: user.email,
            verificationCode,
        };

        await redisClient.setex(redisKey, 120, JSON.stringify(redisData));
        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({ message: 'Verification code sent to your email. Please check your inbox.' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(400).json({ message: error.message });
    }
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Cari pengguna berdasarkan email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Pencarian key dengan pola 'id_reset_passcode*'
        const redisPattern = 'id_reset_passcode:*';
        const keys = await redisClient.keys(redisPattern);  // Dapatkan semua key yang cocok dengan pola

        // Loop untuk mencari key yang sesuai dengan email di dalamnya
        let redisData = null;
        for (let key of keys) {
            const data = await redisClient.get(key);
            const parsedData = JSON.parse(data);

            // Jika email ditemukan di Redis
            if (parsedData.email === email) {
                redisData = parsedData;
                break;
            }
        }

        // Jika tidak ada data ditemukan di Redis
        if (!redisData) {
             // Buat kode verifikasi baru
             const verificationCode = Math.floor(1000 + Math.random() * 9000);

             // Simpan kode verifikasi baru ke Redis dengan email yang sama
             const newRedisData = {
                 email: user.email,
                 verificationCode,
             };
 
             const newRedisKey = `id_reset_passcode:${verificationCode}`; // Membuat key baru dengan kode verifikasi baru
             await redisClient.setex(newRedisKey, 120, JSON.stringify(newRedisData));
 
             // Kirimkan email dengan kode verifikasi baru
             await sendVerificationEmail(email, verificationCode);
 
             return res.status(200).json({
                 message: 'New verification code sent to your email. Please check your inbox.'
             });
        }

        // Hapus kode verifikasi lama
        await redisClient.del(`id_reset_passcode:${redisData.verificationCode}`);

        // Buat kode verifikasi baru
        const verificationCode = Math.floor(1000 + Math.random() * 9000);

        // Simpan kode verifikasi baru ke Redis dengan email yang sama
        const newRedisData = {
            email: user.email,
            verificationCode,
        };

        const newRedisKey = `id_reset_passcode:${verificationCode}`; // Membuat key baru dengan kode verifikasi baru
        await redisClient.setex(newRedisKey, 120, JSON.stringify(newRedisData));

        // Kirimkan email dengan kode verifikasi baru
        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({
            message: 'New verification code sent to your email. Please check your inbox.'
        });

    } catch (error) {
        console.error('Error resending verification email:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const verifyCode = async (req, res) => {
    const { verificationCode } = req.body

    try {
         // Ambil data langsung dari Redis berdasarkan verificationCode
        const redisKey = `id_reset_passcode:${verificationCode}`;
        const dataString = await redisClient.get(redisKey);

        if (!dataString) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        const redisData = JSON.parse(dataString);
        const email = redisData.email;

        // Simpan informasi verifikasi berhasil ke Redis
        const passwordResetKey = `verif_reset_passcode:${verificationCode}`;
        await redisClient.setex(passwordResetKey, 1200, JSON.stringify({ email }));

        // Hapus data kunci lama
        await redisClient.del(redisKey);

        return res.status(200).json({ message: 'Verification code is valid.' });
    } catch (error) {
        console.error('Error verifying code:', error.message);
        res.status(500).json({ message: 'Server error' });
    }

}

const newPassword = async (req, res) => {
    const { verificationCode, newPassword, confirmPassword } = req.body;

    try {
        // Validasi input
        if (!verificationCode || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Input tidak boleh kosong' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password harus memiliki minimal 8 karakter' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Password and confirm password do not match.' });
        }

        // Ambil data dari Redis berdasarkan verificationCode
        const redisKey = `verif_reset_passcode:${verificationCode}`;
        const dataString = await redisClient.get(redisKey);

        if (!dataString) {
            return res.status(400).json({ message: 'Sesi lupa password anda sudah habis, silahkan coba ulang' });
        }

        const redisData = JSON.parse(dataString);
        const email = redisData.email;

        // Hash password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password user di database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.password = hashedPassword;
        await user.save();

        // Kirim email konfirmasi
        await sendConfirmationEmail(email);

        // Hapus data verifikasi dari Redis
        await redisClient.del(redisKey);

        return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error changing password:', error.message);
        return res.status(500).json({ message: 'Server error.' });
    }
}

module.exports = { verifyEmail, resendVerifyEmail, verifyCode, newPassword, sendConfirmationEmail }