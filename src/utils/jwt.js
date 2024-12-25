// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY || 'mysecretkey12345!@#security', { expiresIn: '7d' });
};

module.exports = { generateToken};
