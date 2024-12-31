const { formatDateTime, addMinutesToDate } = require('../utils/dateHelper')
const Color = require("../models/Color");
const Day = require("../models/Days");
const Studying = require("../models/Studying");
const Activity = require("../models/Activity");

const createStudySchedule = async (req, res) => {
    try {
        const { title, day_id, start_time, end_time, place, room, color_id } = req.body;
    
        // Validasi input
        if (!title || !day_id || !start_time || !end_time || !place || !room || !color_id) {
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
        const newStudying = new Studying({
          title,
          day_id,
          start_time,
          end_time,
          place,
          room,
          color_id,
          user_id: req.user._id, // Ambil ID pengguna dari token autentikasi
        });
    
        // Simpan ke database
        const savedStudying = await newStudying.save();
    
        res.status(201).json({
          message: 'Jadwal kuliah berhasil dibuat.',
          data: savedStudying,
        });
      } catch (error) {
        console.error('Kesalahan membuat jadwal kuliah:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
      }
}

const editStudySchedule = async (req, res) => {
    try {
        const { id } = req.params; // ID jadwal yang akan diubah
        const { title, day_id, start_time, end_time, place, room, color_id } = req.body;

        // Validasi input
        if (!title || !day_id || !start_time || !end_time || !place || !room || !color_id) {
            return res.status(400).json({ message: 'Semua input data harus diisi.' });
        }

        // Validasi bahwa jadwal belajar yang akan diubah ada di database
        const studyingExists = await Studying.findById(id);
        if (!studyingExists) {
            return res.status(404).json({ message: 'Jadwal belajar tidak ditemukan.' });
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

        // Update jadwal belajar
        studyingExists.title = title;
        studyingExists.day_id = day_id;
        studyingExists.start_time = start_time;
        studyingExists.end_time = end_time;
        studyingExists.place = place;
        studyingExists.room = room;
        studyingExists.color_id = color_id;

        // Simpan perubahan ke database
        const updatedStudying = await studyingExists.save();

        res.status(200).json({
            message: 'Jadwal kuliah berhasil diperbarui.',
            data: updatedStudying,
        });
    } catch (error) {
        console.error('Kesalahan memperbarui jadwal kuliah:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};

module.exports = { createStudySchedule, editStudySchedule };