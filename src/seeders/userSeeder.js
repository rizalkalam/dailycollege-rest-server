const mongoose = require('mongoose');
const User = require('../models/User'); // Path ke model User Anda
const connectDB = require('../config/database'); // Path ke file koneksi database
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        // Hubungkan ke database
        await connectDB();

        console.log('Seeding users...');

        // Hapus semua data pengguna (opsional)
        await User.deleteMany();

        // Data manual untuk dimasukkan
        const users = [
            {
                name: 'Ade Setiawan',
                email: 'adeadeade@example.com',
                password: 'password123',
                googleId: 'google-1234',
                avatar: null
            },
            {
                name: 'Azrul Ananda',
                email: 'azazaza@example.com',
                password: 'password456',
                googleId: null,
                avatar: null
            },
            {
                name: 'Charlie Brown',
                email: 'charlie@example.com',
                password: 'password789',
                googleId: null,
                avatar: null
            },
            {
                name: 'Lando Norris',
                email: 'norris@example.com',
                password: 'password101',
                googleId: null,
                avatar: null
            },
            {
                name: 'Erika Yanti',
                email: 'nugasyukmyid@gmail.com',
                password: 'erika123',
                googleId: null,
                avatar: null
            },
        ];

        // Hash password menggunakan bcrypt
        const saltRounds = 10;
        for (let user of users) {
            user.password = await bcrypt.hash(user.password, saltRounds);
        }

        // Masukkan data ke database
        await User.insertMany(users);

        console.log('Users seeded successfully!');
        process.exit(0); // Keluar setelah selesai
    } catch (error) {
        console.error(`Error seeding users: ${error.message}`);
        process.exit(1); // Keluar dengan kode error
    }
};

seedUsers();
