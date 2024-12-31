const Day = require("../models/Days");

let cachedDays = [];

const getDays = async (req, res) => {
    try {
        const days = await Day.find({}, 'name');
        cachedDays = days; // Simpan ke cache
        res.status(200).json({
            message: 'Data hari.',
            data: days,
        });
    } catch (error) {
        console.error('Gagal memuat data hari:', error);
        res.status(500).json({
            message: 'Gagal memuat data hari.',
            error: error.message,
        });
    }
};

module.exports = { getDays };
