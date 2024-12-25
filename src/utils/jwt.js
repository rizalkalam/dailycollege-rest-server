// utils/jwt.js
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient')

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY || 'mysecretkey12345!@#security', { expiresIn: '1h' });
};

const generateRefreshToken = async (userId) => {
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Simpan refresh token ke Redis dengan waktu kedaluwarsa (7 hari) menggunakan 'EX' untuk expiration time
    await redisClient.set(`refreshToken:${refreshToken}`, userId);
    await redisClient.expire(`refreshToken:${refreshToken}`, 7 * 24 * 60 * 60); // Set EX manually (7 days in seconds)

    return refreshToken;
};

const validateRefreshToken = async (refreshToken) => {
    const userId = await redisClient.get(`refreshToken:${refreshToken}`);
    return userId;
};

const revokeRefreshToken = async (refreshToken) => {
    await redisClient.del(`refreshToken:${refreshToken}`);
};

module.exports = { generateToken, generateRefreshToken, validateRefreshToken, revokeRefreshToken };
