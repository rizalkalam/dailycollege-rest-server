const getUser = async (req, res) => {
    try {
        // Pastikan req.user ada dan memiliki properti yang diperlukan
        if (!req.user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        // Pilih hanya properti id, username, dan email dari pengguna
        const userData = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        };

        // Kirimkan data pengguna dalam respons
        return res.status(200).json({
            message: 'Data pengguna berhasil diambil',
            data: userData
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data pengguna',
            error: error.message
        });
    }
}

module.exports = { getUser }