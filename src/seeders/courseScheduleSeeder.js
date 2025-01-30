const mongoose = require('mongoose');
const CourseSchedule = require('../models/CourseSchedule'); // Path ke model CourseSchedule Anda
const Day = require('../models/Days'); // Path ke model Day Anda
const User = require('../models/User'); // Path ke model User Anda
const connectDB = require('../config/database'); // Path ke file koneksi database

const seedCourseSchedules = async () => {
    try {
        await connectDB();
        console.log('Seeding course schedules...');

        // Hapus semua data jadwal kuliah (opsional)
        await CourseSchedule.deleteMany({});

        // Mencari pengguna dan hari
        const user_1 = await User.findOne({ email: 'nugasyukmyid@gmail.com' });
        const user_2 = await User.findOne({ email: 'adesetiawan@gmail.com' });
        const day_monday = await Day.findOne({ name: 'Senin' });
        const day_tuesday = await Day.findOne({ name: 'Selasa' });

        if (!user_1 || !user_2 || !day_monday || !day_tuesday) {
            console.log("Pengguna atau hari yang diperlukan tidak ditemukan!");
            return;
        }

        // Data contoh untuk jadwal kuliah
        const courseSchedules = [
            { day_id: day_monday._id, subject: 'Matematika', start_time: '08:00', end_time: '10:00', location: 'Ruang A', user_id: user_1._id },
            { day_id: day_tuesday._id, subject: 'Fisika', start_time: '10:00', end_time: '12:00', location: 'Ruang B', user_id: user_1._id },
            { day_id: day_monday._id, subject: 'Kimia', start_time: '13:00', end_time: '15:00', location: 'Ruang C', user_id: user_2._id },
            { day_id: day_tuesday._id, subject: 'Biologi', start_time: '08:00', end_time: '10:00', location: 'Ruang D', user_id: user_2._id },
        ];

        // Simpan data ke database
        await CourseSchedule.insertMany(courseSchedules);
        console.log('Data jadwal kuliah berhasil disimpan.');

    } catch (error) {
        console.error('Kesalahan saat seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Jalankan seeder
seedCourseSchedules();