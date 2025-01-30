// seeders/daySeeder.js
const mongoose = require('mongoose');
const Day = require('../models/Days'); // Path ke model Day Anda
const connectDB = require('../config/database'); // Path ke file koneksi database

const seedDays = async () => {
    try {
        await connectDB();
        console.log('Seeding days...');

        // Hapus semua data hari (opsional)
        await Day.deleteMany();

        // Data hari
        const days = [
            { name: 'Senin' },
            { name: 'Selasa' },
            { name: 'Rabu' },
            { name: 'Kamis' },
            { name: 'Jumat' },
            { name: 'Sabtu' }
        ];

        // Masukkan data ke database
        await Day.insertMany(days);
        console.log('Days seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error(`Error seeding days: ${error.message}`);
        process.exit(1);
    }
};

seedDays();
