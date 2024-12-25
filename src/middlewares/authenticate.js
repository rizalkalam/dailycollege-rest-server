const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // console.log("Authorization header sent by Swagger:", req.headers['authorization']);
    
    // Ambil token dari header Authorization
    const token = req.headers['authorization']?.replace('Bearer ', ''); // Perbaiki cara mengakses header

    // console.log("Token received:", token); // Menambahkan log untuk memeriksa token

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "mysecretkey12345!@#security");

        // Pastikan bahwa `id` ada di dalam token, jika tidak, beri respons error
        if (!decoded.id) {
            return res.status(401).json({ message: 'Invalid token: id missing.' });
        }

        // Simpan id ke request object untuk digunakan di query
        req.user_id = decoded.id;  
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.', error: err.message });
    }
};

module.exports = authenticate;
