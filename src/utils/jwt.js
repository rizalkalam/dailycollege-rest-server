// utils/jwt.js
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient'); // Pastikan Redis sudah terhubung

const generateToken = async (userId) => {
    // Generate token
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_KEY || 'mysecretkey12345!@#security',
        { expiresIn: '3d' }
    );

    // Simpan token ke Redis dengan waktu expired yang sama
    const redisKey = `user:${userId._id}:${token}`;
    await redisClient.set(redisKey, token);
    await redisClient.expire(redisKey, 3 * 24 * 60 * 60 * 1000); // Sesuaikan dengan expiresIn (7 hari)

    return token;
};

const revokeToken = async (userId, token) => {
    // Hapus token dari Redis saat logout
    const redisKey = `user:${userId}:tokens`;
    await redisClient.srem(redisKey, token);
};

module.exports = { generateToken, revokeToken};
