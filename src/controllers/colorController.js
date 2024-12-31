const Color = require("../models/Color");

// Variabel global untuk menyimpan data warna (jika diperlukan caching)
let cachedColors = [];

const getColors = async (req, res) => {
    try {
        // Ambil data warna dari database
        const colors = await Color.find({}, 'color_name color_value');
        
        // Simpan data warna di cache untuk penggunaan berikutnya
        cachedColors = colors;

        // Kirimkan response ke frontend
        res.status(200).json({
            message: 'Data warna.',
            data: colors,
        });
    } catch (error) {
        console.error('Gagal memuat data warna:', error);

        // Kirimkan response error
        res.status(500).json({
            message: 'Gagal memuat data warna.',
            error: error.message,
        });
    }
};

module.exports = { getColors }