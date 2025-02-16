const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('../config/redisClient');

const authenticate = async (req, res, next) => {
     // Ambil token dari header Authorization
     const token = req.headers['authorization']?.replace('Bearer ', '');

     // Jika token tidak ditemukan, beri respons error
     if (!token) {
         return res.status(401).json({ message: 'Akses ditolak. Token tidak sah.' });
     }
 
     try {
         // Verifikasi token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "mysecretkey12345!@#security");
 
         // Pastikan bahwa `id` ada di dalam token
         if (!decoded.id) {
             return res.status(401).json({ message: 'Token tidak valid: tidak ada id.' });
         }

         const userId = decoded.id;

         // Cek apakah token aktif ada di Redis
        const authKey = `user:${userId._id}:${token}`; // <-- Sesuaikan format key
        const isAuth = await redisClient.get(authKey);
        
        if (!isAuth) {
            return res.status(401).json({ message: 'Kode autentikasi anda salah/expired' });
        }
 
         // Simpan data pengguna ke dalam req.user
         req.user = userId;
         req.token = token;
 
         // Lanjutkan ke route handler berikutnya
         next();
     } catch (err) {
        return res.status(401).json({ message: 'Kode autentikasi anda salah/expired', error: err.message });
     }
};

module.exports = authenticate;
