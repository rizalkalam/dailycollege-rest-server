const CalendarEvent = require('../models/CalendarEvent');

const getCalendar = async (req, res) => {
    try {
        const userId = req.user._id;

         // Ambil semua data calendar dari database
         const calendars = await CalendarEvent.find({ user_id: userId })
         .populate('color_id', 'color_name color_value')
         .sort({startDate: 1});

        // Transformasi data ke format yang diinginkan
        const formattedCalendar = calendars.map(calendar => ({
            _id: calendar._id,
            title: calendar.title,
            startDate: calendar.startDate.toISOString().split('T')[0], // Format YYYY-MM-DD
            endDate: calendar.endDate.toISOString().split('T')[0], // Format YYYY-MM-DD
            color_accents: {
                color_id: calendar.color_id.id,        
                color_name: calendar.color_id.color_name,
                color_value: calendar.color_id.color_value
            }
        }));

        // Kirimkan response ke frontend
        res.status(200).json({
            message: 'Data kalender berhasil diambil',
            data: formattedCalendar,
        });
    } catch (error) {
        console.error('Kesalahan saat mengambil data kalender:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data kalender'
        });
    }
}

const getCalendarByDate = async (req, res) => {
    try {
        const userId = req.user._id
        const { date } = req.query

        // Validasi format tanggal
        if (!date) {
            return res.status(400).json({
                message: 'Tanggal tidak diberikan.',
            });
        }

        // Konversi tanggal ke format yang sesuai
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Tambahkan satu hari untuk mencakup seluruh hari

        // Ambil data kalender berdasarkan tanggal
        const calendars = await CalendarEvent.find({
            user_id: userId,
            startDate: { $gte: startDate, $lt: endDate } // Mencari acara yang dimulai pada tanggal yang diberikan
        }).populate('color_id'); // Mengambil informasi warna

         // Format data untuk respons
         const formattedCalendar = calendars.map(calendar => ({
            _id: calendar._id,
            user_id: calendar.user_id,
            title: calendar.title,
            startDate: calendar.startDate.toISOString().split('T')[0], // Format YYYY-MM-DD
            endDate: calendar.endDate.toISOString().split('T')[0],     // Format YYYY-MM-DD
            startTime: calendar.startTime,
            endTime: calendar.endTime,
            note: calendar.note,
            location: calendar.location,
            reminderTime: calendar.reminderTime,
            color_accents: {
                color_id: calendar.color_id._id,
                color_name: calendar.color_id.color_name,
                color_value: calendar.color_id.color_value,
            },
        }));

        // Kirimkan response ke frontend
        res.status(200).json({
            message: 'Data kalender berhasil diambil',
            data: formattedCalendar,
        });
    } catch (error) {
        console.error('Kesalahan saat mengambil data kalender:', error);
        res.status(500).json({
            message: 'Kesalahan saat mengambil data kalender',
            error: error.message,
        });
    }
}

const getCalendarById = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params

        // Cari data kalender berdasarkan ID
        const calendar = await CalendarEvent.findById(id)

        // Jika tidak ditemukan, kirimkan respons 404
        if (!calendar) {
            return res.status(404).json({
                message: 'Data kalender tidak ditemukan.',
            });
        }

        // Format respons sesuai kebutuhan
        res.status(200).json({
            message: 'Data kalender berhasil diambil',
            data: {
                _id: calendar._id,
                title: calendar.title,
                startDate: calendar.startDate.toISOString().split('T')[0], // Format YYYY-MM-DD
                endDate: calendar.endDate.toISOString().split('T')[0], // Format YYYY-MM-DD
                startTime: calendar.startTime,
                endTime: calendar.endTime,
                note: calendar.note,
                location: calendar.location,
                reminderTime: calendar.reminderTime,
            },
        });
    } catch (error) {
        console.error('Kesalahan saat mengambil data kalender:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data kalender',
        });
    }       
}

const addCalendar = async (req, res) => {
    try {
         const userId = req.user._id   
         const { title, startDate, endDate, startTime, endTime, note, location, reminderTime, color_id } = req.body;

         // Validasi input
        if (!title || !startDate || !endDate || !startTime || !endTime || !note || !location || !reminderTime || !color_id) {
            return res.status(400).json({
                message: 'Semua field harus diisi.',
            });
        }

        // Buat objek baru untuk CalendarEvent
        const newEvent = new CalendarEvent({
            user_id: userId,
            title,
            startDate,
            endDate,
            startTime,
            endTime,
            note,
            location,
            reminderTime,
            color_id,
        });

        // Simpan data ke database
        const savedEvent = await newEvent.save();

        // Kirimkan response ke frontend
        res.status(201).json({
            message: 'Data kalender berhasil ditambahkan',
            data: savedEvent,
        });
    } catch (error) {
        console.error('Kesalahan saat menambahkan data kalender:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data kalender',
        });
    }
}

const editCalenderById = async (req, res) => {
    try {
        const { id } = req.params
        const { title, startDate, endDate, startTime, endTime, note, location, reminderTime, color_id } = req.body; // Ambil data dari body request

        // Cari dan update data kalender berdasarkan ID dan user_id
        const updatedCalendar = await CalendarEvent.findByIdAndUpdate(
            id,
            {
                title,
                startDate,
                endDate,
                startTime,
                endTime,
                note,
                location,
                reminderTime,
                color_id // Update color_id jika diberikan
            },
            { new: true } // Mengembalikan dokumen yang diperbarui
        );

        // Jika tidak ada acara ditemukan
        if (!updatedCalendar) {
            return res.status(404).json({
                message: 'Data tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya.',
            });
        }

        // Kirimkan response dengan data yang telah diperbarui
        res.status(200).json({
            message: 'Data kalender berhasil diperbarui',
            data: updatedCalendar,
        });
    } catch (error) {
        console.error('Kesalahan saat memperbarui data kalender:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat memperbarui data kalender',
            error: error.message,
        });
    }
}

const deleteCalender = async (req, res) => {
    try {
        const { id } = req.params

        // Cari dan hapus acara kalender berdasarkan ID
        const deletedCalendar = await CalendarEvent.findByIdAndDelete(id);

        // Jika tidak ada acara ditemukan dengan ID tersebut
        if (!deletedCalendar) {
            return res.status(404).json({
                message: 'Data kalender tidak ditemukan.',
            });
        }

        // Kirimkan respons sukses
        res.status(200).json({
            message: 'Data kalender berhasil dihapus.',
            data: deletedCalendar,
        });
    } catch (error) {
        console.error('Kesalahan saat menghapus data kalender:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus data kalender.',
            error: error.message,
        });
    }
}

module.exports = { getCalendar, getCalendarByDate, getCalendarById, addCalendar, editCalenderById, deleteCalender }