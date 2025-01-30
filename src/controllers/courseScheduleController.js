const CourseSchedule = require('../models/CourseSchedule'); 

const getCourseSchedulesByDay = async (req, res) => {
    try {
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user

        // Mengambil semua jadwal kuliah yang sesuai dengan user_id
        const schedules = await CourseSchedule.find({ user_id: userId }).populate('day_id');

        // Mengelompokkan jadwal berdasarkan hari
        const groupedSchedules = schedules.reduce((acc, schedule) => {
            const dayId = schedule.day_id._id; // Mengambil ID hari dari day_id
            const dayName = schedule.day_id.name; // Mengambil nama hari dari day_id

            // Mencari apakah hari sudah ada di accumulator
            let dayEntry = acc.find(entry => entry.day === dayName);

            // Jika hari belum ada, buat entri baru
            if (!dayEntry) {
                dayEntry = {
                    id: dayId, // Menyimpan ID hari
                    day: dayName,
                    schedules: [] // Inisialisasi array untuk jadwal
                };
                acc.push(dayEntry); // Tambahkan entri baru ke accumulator
            }

            // Menambahkan jadwal ke array hari yang sesuai
            dayEntry.schedules.push({
                _id: schedule._id,
                subject: schedule.subject,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
                location: schedule.location,
                user_id: schedule.user_id
            });

            return acc;
        }, []);

        // Membuat respons dengan format yang diinginkan
        res.status(200).json({
            message: 'Jadwal kuliah berhasil diambil.',
            data: groupedSchedules
        });
    } catch (error) {
        console.error('Kesalahan saat mengambil jadwal kuliah:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};

const getCourseSchedulesByDayId = async (req, res) => {
    try {
        const { dayId } = req.params; // Mengambil ID hari dari parameter URL
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user

        // Mengambil semua jadwal kuliah yang sesuai dengan user_id dan day_id
        const schedules = await CourseSchedule.find({ user_id: userId, day_id: dayId }).populate('day_id');

        // Jika tidak ada jadwal ditemukan
        if (schedules.length === 0) {
            return res.status(404).json({ message: 'Tidak ada jadwal kuliah ditemukan untuk hari ini.' });
        }

        // Mengelompokkan jadwal berdasarkan hari
        const responseData = {
            id: dayId,
            day: schedules[0].day_id.name, // Mengambil nama hari dari jadwal pertama
            schedules: schedules.map(schedule => ({
                _id: schedule._id,
                subject: schedule.subject,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
                location: schedule.location,
                user_id: schedule.user_id
            }))
        };

        res.status(200).json({
            message: 'Jadwal kuliah berhasil diambil.',
            data: responseData
        });
    } catch (error) {
        console.error('Kesalahan saat mengambil jadwal kuliah:', error);
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
        const { day_id, subject, start_time, end_time, location } = req.body; // Mengambil data dari body

        // Validasi input
        if (!day_id || !subject || !start_time || !end_time || !location) {
            return res.status(400).json({ message: 'Semua field harus diisi.' });
        }

        // Membuat jadwal baru
        const newSchedule = new CourseSchedule({
            day_id, // Menyimpan ID hari
            subject,
            start_time,
            end_time,
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

const updateCourseSchedulesByDayId = async (req, res) => {
    try {
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user
        const { dayId } = req.params; // Mengambil ID hari dari parameter URL
        const { schedules } = req.body; // Mengambil array jadwal dari body

        // Validasi input
        if (!Array.isArray(schedules) || schedules.length === 0) {
            return res.status(400).json({ message: 'Array jadwal harus disediakan.' });
        }

        // Mengupdate setiap jadwal kuliah
        const updatedSchedules = await Promise.all(
            schedules.map(async (schedule) => {
                const { _id, ...updateData } = schedule; // Mengambil ID dan data yang ingin diupdate
                const updatedSchedule = await CourseSchedule.findOneAndUpdate(
                    { _id, user_id: userId, day_id: dayId }, // Mencari berdasarkan ID, user_id, dan day_id
                    { $set: updateData }, // Mengupdate data
                    { new: true } // Mengembalikan dokumen yang telah diperbarui
                );

                if (!updatedSchedule) {
                    throw new Error(`Jadwal kuliah dengan ID ${_id} tidak ditemukan.`);
                }

                return updatedSchedule; // Mengembalikan jadwal yang telah diperbarui
            })
        );

        res.status(200).json({
            message: 'Jadwal kuliah berhasil diperbarui.',
            data: updatedSchedules // Mengembalikan data yang telah diperbarui
        });
    } catch (error) {
        console.error('Kesalahan saat memperbarui jadwal kuliah:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};

const updateCourseScheduleById = async (req, res) => {  
    try {  
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user  
        const { id } = req.params; // Mengambil ID dari parameter URL  
        const { day, subject, start_time, end_time, location } = req.body;  
  
        // Mencari jadwal berdasarkan ID dan user_id  
        const schedule = await CourseSchedule.findOne({ _id: id, user_id: userId });  
  
        if (!schedule) {  
            return res.status(404).json({ message: 'Jadwal kuliah tidak ditemukan.' });  
        }  
  
        // Memperbarui data jadwal  
        if (day) schedule.day = day;  
        if (subject) schedule.subject = subject;  
        if (start_time) schedule.start_time = start_time;  
        if (end_time) schedule.end_time = end_time;  
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


module.exports = { getCourseSchedulesByDay, getCourseSchedulesByDayId, getCourseScheduleById, addCourseSchedule, updateCourseSchedulesByDayId, updateCourseScheduleById, deleteCourseSchedule };  