const Color = require("../models/Color");

// Variabel global untuk menyimpan data warna (jika diperlukan caching)
let cachedColors = [];

const getColors = async (req, res) => {
    try {
        // Jika data warna sudah ada di cache, gunakan cache
        if (cachedColors.length > 0) {
            return res.status(200).json({
                message: "Data warna diambil dari cache",
                colors: cachedColors,
            });
        }

        // Ambil data warna dari database
        const colors = await Color.find({}, 'color_name color_value');

        // Simpan data warna di cache untuk penggunaan berikutnya
        cachedColors = colors;

        // Kirimkan response ke frontend
        res.status(200).json({
            message: "Data warna berhasil diambil",
            colors: colors,
        });
    } catch (error) {
        console.error("Error fetching colors:", error);
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil data warna",
            error: error.message,
        });
    }
};

module.exports = { getColors }