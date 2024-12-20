const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000; // Menentukan port aplikasi (pastikan PORT ada di .env)

// Koneksi ke MongoDB
connectDB();

// Jalankan server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
