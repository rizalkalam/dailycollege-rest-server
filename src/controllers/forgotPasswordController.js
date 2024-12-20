const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

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
        from: 'rizalkhoiru6@gmail.com',
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

         // Simpan email pengguna ke session
         req.session.userEmail = { email: user.email };

        const verificationCode = Math.floor(10000 + Math.random() * 90000);

        req.session.verificationCode = verificationCode;
        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({ message: 'Verification code sent to your email. Please check your inbox.' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(400).json({ message: error.message });
    }
}

const verifyCode = async (req, res) => {
    const { verificationCode } = req.body

    // Cek apakah kode verifikasi di session ada dan cocok
    if (verificationCode !== req.session.verificationCode) {
        console.log('Verification code mismatch or missing session data');
        return res.status(400).json({ message: 'Invalid verification code.' });
    }

    req.session.forgotPasswordCode = verificationCode

    return res.status(200).json({
        message: 'Verification code is valid.',
    });
}

const newPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body

    try {        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Password and confirm password do not match' });
        }

        if (!req.session.forgotPasswordCode) {
            return res.status(400).json({ message: 'Verification code is required. Please verify your email first.' });
        }

        const { email } = req.session.userEmail;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = hashedPassword;
        await user.save();

        await sendConfirmationEmail(email)

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { verifyEmail, verifyCode, newPassword, sendConfirmationEmail }