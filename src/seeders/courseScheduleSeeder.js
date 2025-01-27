const mongoose = require('mongoose');  
const User = require('../models/User'); // Path ke model User Anda
const CourseSchedule = require('../models/CourseSchedule'); // Sesuaikan dengan path model Anda  
const connectDB = require('../config/database'); // Path ke file koneksi database
  
const seedCourseSchedules = async () => {  
    try {  
        // Hubungkan ke database
        await connectDB();

        console.log('Seeding CourseSchedule...');
  
        // Hapus data yang ada (opsional)  
        await CourseSchedule.deleteMany({});  

        const user_1 = await User.findOne({ email: 'nugasyukmyid@gmail.com' });
        const user_2 = await User.findOne({ email: 'adesetiawan@gmail.com' });
  
        if (!user_1 || !user_2) {
            console.log("Required users not found!");
            return;
        }

        // Data contoh untuk user_1  
        const courseSchedules = [  
            { day: 'Senin', subject: 'Matematika', start_time: '08:00', end_time: '10:00', location: 'Ruang A', user_id: user_1._id },  
            { day: 'Selasa', subject: 'Fisika', start_time: '10:00', end_time: '12:00', location: 'Ruang B', user_id: user_1._id },  
            { day: 'Rabu', subject: 'Kimia', start_time: '13:00', end_time: '15:00', location: 'Ruang C', user_id: user_1._id },  
            { day: 'Kamis', subject: 'Biologi', start_time: '08:00', end_time: '10:00', location: 'Ruang D', user_id: user_1._id },  
            { day: 'Jumat', subject: 'Sejarah', start_time: '10:00', end_time: '12:00', location: 'Ruang E', user_id: user_1._id },  
        ];  
  
        // Data contoh untuk user_2  
        const courseSchedulesUser2 = [  
            { day: 'Senin', subject: 'Geografi', start_time: '08:00', end_time: '10:00', location: 'Ruang F', user_id: user_2._id },  
            { day: 'Selasa', subject: 'Ekonomi', start_time: '10:00', end_time: '12:00', location: 'Ruang G', user_id: user_2._id },  
            { day: 'Rabu', subject: 'Seni', start_time: '13:00', end_time: '15:00', location: 'Ruang H', user_id: user_2._id },  
            { day: 'Kamis', subject: 'Olahraga', start_time: '08:00', end_time: '10:00', location: 'Ruang I', user_id: user_2._id },  
            { day: 'Jumat', subject: 'Bahasa Inggris', start_time: '10:00', end_time: '12:00', location: 'Ruang J', user_id: user_2._id },  
        ];  
  
        // Gabungkan kedua array jadwal  
        const allCourseSchedules = [...courseSchedules, ...courseSchedulesUser2];  
  
        // Simpan data ke database  
        await CourseSchedule.insertMany(allCourseSchedules);  
        
        console.log('CourseSchedule seeded successfully!');
        process.exit(0); // Keluar setelah selesai
    } catch (error) {  
        console.error('Kesalahan saat seeding data:', error);  
    } finally {  
        // Tutup koneksi  
        process.exit(1); // Keluar dengan kode error
    }  
};  
  
// Jalankan fungsi seeder  
seedCourseSchedules();  
