// utils/jwt.js
const jwt = require('jsonwebtoken');

// Fungsi untuk menghasilkan token JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
};

// Middleware untuk memverifikasi token JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Ambil token dari header Authorization

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = { generateToken, authenticateJWT };
