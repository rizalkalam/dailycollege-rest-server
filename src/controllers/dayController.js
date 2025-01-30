const Day = require('../models/Days');  

const getDays = async (req, res) => {
    try {
        const days = await Day.find();
        res.status(200).json({ message: 'Daftar hari berhasil diambil.', data: days });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan server.', error: error.message });
    }
};

module.exports = { getDays };
