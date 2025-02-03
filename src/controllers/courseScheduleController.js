const CourseSchedule = require('../models/CourseSchedule');
const Day = require('../models/Days');  

const getCourseSchedulesByDay = async (req, res) => {
    try {
        const userId = req.user._id; // Mendapatkan ID pengguna dari req.user
        const dayName = req.query.day; // Mengambil nama hari dari query

        // Mengambil semua hari dari model Day
        const days = await Day.find();

        // Mengambil semua jadwal kuliah yang sesuai dengan user_id
        const schedules = await CourseSchedule.find({ user_id: userId }).populate('day_id');

        // Mengelompokkan jadwal berdasarkan hari
        const groupedSchedules = days.map(day => {
            // Filter jadwal untuk hari yang sesuai
            const daySchedules = schedules.filter(schedule => schedule.day_id.name === day.name);

            return {
                id: day._id,
                day: day.name,
                schedules: daySchedules.map(schedule => ({
                    _id: schedule._id,
                    subject: schedule.subject,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    location: schedule.location
                }))
            };
        });

        // Jika parameter dayName diberikan, filter hasilnya
        const responseSchedules = dayName 
            ? groupedSchedules.filter(group => group.day.toLowerCase() === dayName.toLowerCase())
            : groupedSchedules;

        res.status(200).json({
            message: 'Jadwal kuliah berhasil diambil.',
            data: responseSchedules
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
        const userId = req.user._id;
        const dayIdParams = req.params.dayId; // ID hari dari parameter
        const { dayId: dayIdBody, schedules } = req.body; // Mengambil dayId dari body

        if (!dayIdBody || !Array.isArray(schedules)) {
            return res.status(400).json({ message: 'ID hari dan array jadwal harus disediakan.' });
        }

        // Mengambil semua jadwal yang ada untuk hari dan pengguna tersebut
        const existingSchedules = await CourseSchedule.find({ user_id: userId, day_id: dayIdParams });

        // Jika dayId dari parameter tidak sama dengan dayId dari body
        if (dayIdParams !== dayIdBody) {
            // Update day_id untuk jadwal yang ada
            await CourseSchedule.updateMany(
                { user_id: userId, day_id: dayIdParams },
                { $set: { day_id: dayIdBody } }
            );
        }

        // Mengelola jadwal baru dan yang diperbarui
        for (const schedule of schedules) {
            if (schedule._id) {
                // Jika ada _id, lakukan update
                await CourseSchedule.findByIdAndUpdate(schedule._id, {
                    subject: schedule.subject,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    location: schedule.location,
                    day_id: dayIdBody // Pastikan day_id diperbarui
                });
            } else {
                // Jika tidak ada _id, lakukan create
                const newSchedule = new CourseSchedule({
                    user_id: userId,
                    day_id: dayIdBody,
                    subject: schedule.subject,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    location: schedule.location
                });
                await newSchedule.save();
            }
        }

        // Mengambil semua jadwal yang ada setelah update
        const updatedSchedules = await CourseSchedule.find({ user_id: userId, day_id: dayIdBody });

        return res.status(200).json({
            message: "Jadwal kuliah berhasil diperbarui.",
            data: updatedSchedules
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui jadwal kuliah.' });
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


module.exports = { getCourseSchedulesByDay, getCourseSchedulesByDayId, addCourseSchedule, updateCourseSchedulesByDayId, deleteCourseSchedule };  