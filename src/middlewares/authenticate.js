const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
     // Ambil token dari header Authorization
     const token = req.headers['authorization']?.replace('Bearer ', '');

     // Jika token tidak ditemukan, beri respons error
     if (!token) {
         return res.status(401).json({ message: 'Access Denied. No token provided.' });
     }
 
     try {
         // Verifikasi token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "mysecretkey12345!@#security");
 
         // Pastikan bahwa `id` ada di dalam token
         if (!decoded.id) {
             return res.status(401).json({ message: 'Invalid token: id missing.' });
         }
 
         // Cari pengguna di database berdasarkan `id` yang ada di token
         const user = await User.findById(decoded.id);
         if (!user) {
             return res.status(404).json({ message: 'User not found.' });
         }
 
         // Simpan data pengguna ke dalam req.user
         req.user = user;
 
         // Lanjutkan ke route handler berikutnya
         next();
     } catch (err) {
         // Jika token tidak valid atau kadaluarsa, beri respons error
         return res.status(401).json({ message: 'Invalid or expired token.', error: err.message });
     }
};

module.exports = authenticate;
