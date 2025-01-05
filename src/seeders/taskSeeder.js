// seeders/taskSeeder.js
const mongoose = require('mongoose');
const Task = require('../models/Task'); // Path ke model Task Anda
const User = require('../models/User'); // Path ke model User Anda
const connectDB = require('../config/database'); // Path ke file koneksi database

const seedTasks = async () => {
    try {
        // Hubungkan ke database
        await connectDB();

        console.log('Seeding tasks...');

        // Hapus semua data tugas (opsional)
        await Task.deleteMany();

        // Menemukan pengguna berdasarkan email
        const user_1 = await User.findOne({ email: 'nugasyukmyid@gmail.com' });
        const user_2 = await User.findOne({ email: 'adesetiawan@gmail.com' });

        if (!user_1 || !user_2) {
            console.log("Required users not found!");
            return;
        }

        // Data manual untuk dimasukkan
        const tasks = [
            {
                user_id: user_1._id, // Menggunakan user_1 sebagai user_id
                name: 'Tugas 1',
                detail: 'Detail untuk tugas 1',
                status: 'belum_jalan',
                priority: 'rendah',
                deadline: new Date('2025-01-10')
            },
            {
                user_id: user_2._id, // Menggunakan user_2 sebagai user_id
                name: 'Tugas 2',
                detail: 'Detail untuk tugas 2',
                status: 'sedang_jalan',
                priority: 'sedang',
                deadline: new Date('2025-01-15')
            },
            {
                user_id: user_1._id, // Menggunakan user_1 sebagai user_id
                name: 'Tugas 3',
                detail: 'Detail untuk tugas 3',
                status: 'dalam_antrian',
                priority: 'tinggi',
                deadline: new Date('2025-01-20')
            },
            {
                user_id: user_2._id, // Menggunakan user_2 sebagai user_id
                name: 'Tugas 4',
                detail: 'Detail untuk tugas 4',
                status: 'selesai',
                priority: 'rendah',
                deadline: new Date('2025-01-05')
            }
        ];

        // Masukkan data ke database
        await Task.insertMany(tasks);

        console.log('Tasks seeded successfully!');
        process.exit(0); // Keluar setelah selesai
    } catch (error) {
        console.error(`Error seeding tasks: ${error.message}`);
        process.exit(1); // Keluar dengan kode error
    }
};

seedTasks();