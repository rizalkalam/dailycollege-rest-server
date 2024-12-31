const { formatDateTime, addMinutesToDate } = require('../utils/dateHelper')
const Color = require("../models/Color");
const Day = require("../models/Days");
const Studying = require("../models/Studying");
const Activity = require("../models/Activity");

const createActivitySchedule = async (req, res) => {
    try {
        const { title, day_id, start_time, end_time, description, color_id } = req.body;
    
        // Validasi input
        if (!title || !day_id || !start_time || !end_time || !description || !color_id) {
          return res.status(400).json({ message: 'Semua input data harus diisi.' });
        }
    
        // Validasi bahwa hari dan warna ada di database
        const dayExists = await Day.findById(day_id);
        const colorExists = await Color.findById(color_id);
    
        if (!dayExists) {
          return res.status(404).json({ message: 'Data hari tidak ditemukan.' });
        }
    
        if (!colorExists) {
          return res.status(404).json({ message: 'Data warna tidak ditemukan.' });
        }
    
        // Buat jadwal belajar baru
        const newActivity = new Activity({
          title,
          day_id,
          start_time,
          end_time,
          description,
          color_id,
          user_id: req.user._id, // Ambil ID pengguna dari token autentikasi
        });
    
        // Simpan ke database
        const savedActivity = await newActivity.save();
    
        res.status(201).json({
          message: 'Jadwal kegiatan berhasil dibuat.',
          data: savedActivity,
        });
      } catch (error) {
        console.error('Kesalahan membuat jadwal kegiatan:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
      }
}

const editActivitySchedule = async (req, res) => {
    try {
        const { id } = req.params; // ID aktivitas yang akan diubah
        const { title, description, day_id, start_time, end_time, color_id } = req.body;

        // Validasi input
        if (!title || !description || !day_id || !start_time || !end_time || !color_id) {
            return res.status(400).json({ message: 'Semua input data harus diisi.' });
        }

        // Validasi bahwa aktivitas yang akan diubah ada di database
        const activityExists = await Activity.findById(id);
        if (!activityExists) {
            return res.status(404).json({ message: 'Aktivitas tidak ditemukan.' });
        }

        // Validasi bahwa hari dan warna ada di database
        const dayExists = await Day.findById(day_id);
        const colorExists = await Color.findById(color_id);

        if (!dayExists) {
            return res.status(404).json({ message: 'Data hari tidak ditemukan.' });
        }

        if (!colorExists) {
            return res.status(404).json({ message: 'Data warna tidak ditemukan.' });
        }

        // Update aktivitas
        activityExists.title = title;
        activityExists.description = description;
        activityExists.day_id = day_id;
        activityExists.start_time = start_time;
        activityExists.end_time = end_time;
        activityExists.color_id = color_id;

        // Simpan perubahan ke database
        const updatedActivity = await activityExists.save();

        res.status(200).json({
            message: 'Aktivitas berhasil diperbarui.',
            data: updatedActivity,
        });
    } catch (error) {
        console.error('Kesalahan memperbarui aktivitas:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};


module.exports = { createActivitySchedule, editActivitySchedule };