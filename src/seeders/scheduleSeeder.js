const mongoose = require('mongoose');
const connectDB = require('../config/database'); // Path ke file koneksi database
const User = require('../models/User'); // Pastikan path ke model User benar
const Color = require("../models/Color");
const Day = require("../models/Days");
const Studying = require("../models/Studying");
const Activity = require("../models/Activity");

async function seedSchedules() {
    try {
        // Koneksi ke database
        await connectDB();
        console.log("Connected to MongoDB");

        // Hapus semua data sebelumnya
        await Color.deleteMany({});
        await Day.deleteMany({});
        await Studying.deleteMany({});
        await Activity.deleteMany({});
        console.log("Database cleared");

        // Menemukan pengguna pertama dan kedua berdasarkan email
        const user_1 = await User.findOne({ email: 'nugasyukmyid@gmail.com' });
        const user_2 = await User.findOne({ email: 'adesetiawan@gmail.com' });

        if (!user_1 || !user_2) {
            console.log("Required users not found!");
            return;
        }

        // Seed Colors
        const colors = [
            { color_name: "Red", color_value: "#FF4545" },
            { color_name: "Orange", color_value: "#F98825" },
            { color_name: "Yellow", color_value: "#F8BD00" },
            { color_name: "Green", color_value: "#95E7AF" },
            { color_name: "Blue", color_value: "#5874FF" },
            { color_name: "Purple", color_value: "#9747FF" },
            { color_name: "Beige", color_value: "#FEA88A" },
            { color_name: "Orangesecondary", color_value: "#FFB567" },
            { color_name: "Pink", color_value: "#FF679C" },
        ];
        const colorDocs = await Color.insertMany(colors);
        if (!colorDocs.length) {
            console.log("No colors were inserted!");
            return;
        }
        console.log("Colors seeded!");

        // Seed Days
        const days = [
            { name: "Senin" },
            { name: "Selasa" },
            { name: "Rabu" },
            { name: "Kamis" },
            { name: "Jum'at" },
            { name: "Sabtu" },
            { name: "Minggu" }
        ];
        const dayDocs = await Day.insertMany(days);
        if (!dayDocs.length) {
            console.log("No days were inserted!");
            return;
        }
        console.log("Days seeded!");

        // Seed Studying untuk user_1 dan user_2
        const studyingData = [
            {
                title: "Mathematics",  // Contoh mata pelajaran
                place: "Library",        // Tempat belajar
                room: '3B.TV',           // Ruangan
                color_id: colorDocs[0]._id, // Menggunakan warna pertama
                day_id: dayDocs[0]._id,     // Menggunakan hari pertama
                start_time: "08:00",    // Waktu mulai
                end_time: "10:00",      // Waktu selesai
                user_id: user_1._id,    // User pertama
            },
            {
                title: "Science",     // Contoh mata pelajaran
                place: "Classroom A",   // Tempat belajar
                room: '3B.TV',          // Ruangan
                color_id: colorDocs[1]._id, // Menggunakan warna kedua
                day_id: dayDocs[1]._id,     // Menggunakan hari kedua
                start_time: "10:00",    // Waktu mulai
                end_time: "12:00",      // Waktu selesai
                user_id: user_2._id,    // User kedua
            }
        ];
        const studyingDocs = await Studying.insertMany(studyingData);
        if (!studyingDocs.length) {
            console.log("No studying data was inserted!");
            return;
        }
        console.log("Studying seeded!");

        // Seed Activity untuk user_1 dan user_2
        const activityData = [
            {
                title: "Reading",    // Nama aktivitas
                description: "Reading Mathematics notes", // Deskripsi aktivitas
                color_id: colorDocs[2]._id, // Menggunakan warna ketiga
                day_id: dayDocs[2]._id,     // Menggunakan hari ketiga
                start_time: "09:00",  // Waktu mulai
                end_time: "11:00",    // Waktu selesai
                user_id: user_1._id,  // User pertama
            },
            {
                title: "Experiment",  // Nama aktivitas
                description: "Science lab experiment", // Deskripsi aktivitas
                color_id: colorDocs[3]._id, // Menggunakan warna keempat
                day_id: dayDocs[3]._id,     // Menggunakan hari keempat
                start_time: "11:00",  // Waktu mulai
                end_time: "13:00",    // Waktu selesai
                user_id: user_2._id,  // User kedua
            }
        ];
        const activityDocs = await Activity.insertMany(activityData);
        if (!activityDocs.length) {
            console.log("No activity data was inserted!");
            return;
        }
        console.log("Schedules seeded!");

        console.log("All data seeded successfully!");

    } catch (err) {
        console.log('Error seeding schedules:', err);
    } finally {
        // Pastikan koneksi selalu ditutup
        mongoose.connection.close();
    }
}

seedSchedules();
