const CourseSchedule = require('../models/CourseSchedule'); 

const getCourseSchedulesByDay = async (req, res) => {  
    try {  
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user  
  
        // Mengambil semua jadwal kuliah yang sesuai dengan user_id  
        const schedules = await CourseSchedule.find({ user_id: userId });  
  
        // Mengelompokkan jadwal berdasarkan hari  
        const groupedSchedules = schedules.reduce((acc, schedule) => {  
            const { _id, day, subject, time, location } = schedule;  
  
            // Jika hari belum ada di accumulator, buat array baru  
            if (!acc[day]) {  
                acc[day] = [];  
            }  
  
            // Tambahkan jadwal ke array hari yang sesuai  
            acc[day].push({  
                id: _id,
                subject,  
                time,  
                location  
            });  
  
            return acc;  
        }, {});  
  
        // Mengubah format menjadi array dari objek  
        const responseData = Object.keys(groupedSchedules).map(day => ({  
            [day]: groupedSchedules[day]  
        }));  
  
        res.status(200).json({  
            message: 'Jadwal kuliah berhasil diambil.',  
            data: responseData  
        });  
    } catch (error) {  
        console.error('Kesalahan mengambil jadwal kuliah:', error);  
        res.status(500).json({ message: 'Kesalahan server.' });  
    }  
};

const getCourseScheduleById = async (req, res) => {  
    try {  
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user  
        const { id } = req.params; // Mengambil ID dari parameter URL  
  
        // Mencari jadwal berdasarkan ID dan user_id  
        const schedule = await CourseSchedule.findOne({ _id: id, user_id: userId });  
  
        if (!schedule) {  
            return res.status(404).json({ message: 'Jadwal kuliah tidak ditemukan.' });  
        }  
  
        res.status(200).json({  
            message: 'Jadwal kuliah berhasil diambil.',  
            data: schedule  
        });  
    } catch (error) {  
        console.error('Kesalahan mengambil jadwal kuliah:', error);  
        res.status(500).json({ message: 'Kesalahan server.' });  
    }  
};  

const addCourseSchedule = async (req, res) => {  
    try {  
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user  
        const { day, subject, time, location } = req.body;  
  
        // Validasi input  
        if (!day || !subject || !time || !location) {  
            return res.status(400).json({ message: 'Semua field harus diisi.' });  
        }  
  
        // Membuat jadwal baru  
        const newSchedule = new CourseSchedule({  
            day,  
            subject,  
            time,  
            location,  
            user_id: userId // Menyimpan ID pengguna  
        });  
  
        // Menyimpan jadwal ke database  
        await newSchedule.save();  
  
        res.status(201).json({  
            message: 'Jadwal kuliah berhasil ditambahkan.',  
            data: newSchedule  
        });  
    } catch (error) {  
        console.error('Kesalahan menambahkan jadwal kuliah:', error);  
        res.status(500).json({ message: 'Kesalahan server.' });  
    }  
};

const updateCourseScheduleById = async (req, res) => {  
    try {  
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user  
        const { id } = req.params; // Mengambil ID dari parameter URL  
        const { day, subject, time, location } = req.body;  
  
        // Mencari jadwal berdasarkan ID dan user_id  
        const schedule = await CourseSchedule.findOne({ _id: id, user_id: userId });  
  
        if (!schedule) {  
            return res.status(404).json({ message: 'Jadwal kuliah tidak ditemukan.' });  
        }  
  
        // Memperbarui data jadwal  
        if (day) schedule.day = day;  
        if (subject) schedule.subject = subject;  
        if (time) schedule.time = time;  
        if (location) schedule.location = location;  
  
        // Menyimpan perubahan  
        await schedule.save();  
  
        res.status(200).json({  
            message: 'Jadwal kuliah berhasil diperbarui.',  
            data: schedule  
        });  
    } catch (error) {  
        console.error('Kesalahan memperbarui jadwal kuliah:', error);  
        res.status(500).json({ message: 'Kesalahan server.' });  
    }  
};  

const deleteCourseSchedule = async (req, res) => {  
    try {  
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user  
        const { id } = req.params; // Mengambil ID dari parameter URL  
  
        // Mencari dan menghapus jadwal berdasarkan ID dan user_id  
        const schedule = await CourseSchedule.findOneAndDelete({ _id: id, user_id: userId });  
  
        if (!schedule) {  
            return res.status(404).json({ message: 'Jadwal kuliah tidak ditemukan.' });  
        }  
  
        res.status(200).json({  
            message: 'Jadwal kuliah berhasil dihapus.',  
            data: schedule  
        });  
    } catch (error) {  
        console.error('Kesalahan menghapus jadwal kuliah:', error);  
        res.status(500).json({ message: 'Kesalahan server.' });  
    }  
};  


module.exports = { getCourseSchedulesByDay, getCourseScheduleById, addCourseSchedule, updateCourseScheduleById, deleteCourseSchedule };  