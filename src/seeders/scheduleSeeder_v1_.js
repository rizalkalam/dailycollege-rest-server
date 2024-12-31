const mongoose = require('mongoose');
const connectDB = require('../config/database'); // Path ke file koneksi database
const Schedule = require('../models/Schedule'); // Pastikan path ke model Schedule benar
const User = require('../models/User'); // Pastikan path ke model User benar
const Color = require("../models/Color");
const Studying = require("../models/Studying");
const Activity = require("../models/Activity");

async function seedSchedules() {
    try {
        // Koneksi ke database
        await connectDB();
        console.log("Connected to MongoDB");

        // Hapus semua data sebelumnya
        await Color.deleteMany({});
        await Studying.deleteMany({});
        await Activity.deleteMany({});
        await Schedule.deleteMany({});
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
            { color_name: "Red", color_value: "#FF0000" },
            { color_name: "Blue", color_value: "#0000FF" },
            { color_name: "Green", color_value: "#00FF00" },
            { color_name: "Yellow", color_value: "#FFFF00" },
        ];
        const colorDocs = await Color.insertMany(colors);
        if (!colorDocs.length) {
            console.log("No colors were inserted!");
            return;
        }
        console.log("Colors seeded!");

        // Seed Studying untuk user_1 dan user_2
        const studyingData = [
            {
                title: "Mathematics",  // Contoh mata pelajaran
                place: "Library",        // Tempat belajar
                room: '3B.TV',           // Ruangan
                color_id: colorDocs[0]._id, // Menggunakan warna pertama
                start_date_time: "2024-12-30T08:45:00",
                end_date_time: "2024-12-30T10:00:00",  
                user_id: user_1._id,    // User pertama
            },
            {
                title: "Islamic Faith Education",     // Contoh mata pelajaran
                place: "Classroom A",   // Tempat belajar
                room: '3B.TV',          // Ruangan
                color_id: colorDocs[1]._id, // Menggunakan warna kedua
                start_date_time: "2024-12-30T16:00:00",    // Waktu mulai (start_date_time)
                end_date_time: "2024-12-30T17:20:00",      // Waktu selesai (end_date_time)
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
                start_date_time: "2024-12-31T09:00:00",  // Waktu mulai (start_date_time)
                end_date_time: "2024-12-31T11:00:00",    // Waktu selesai (end_date_time)
                user_id: user_1._id,  // User pertama
            },
            {
                title: "Experiment",  // Nama aktivitas
                description: "Science lab experiment", // Deskripsi aktivitas
                color_id: colorDocs[3]._id, // Menggunakan warna keempat
                start_date_time: "2024-12-31T11:00:00",  // Waktu mulai (start_date_time)
                end_date_time: "2024-12-31T13:00:00",    // Waktu selesai (end_date_time)
                user_id: user_2._id,  // User kedua
            }
        ];
        const activityDocs = await Activity.insertMany(activityData);
        if (!activityDocs.length) {
            console.log("No activity data was inserted!");
            return;
        }
        console.log("Activity seeded!");

        // Seed Schedules untuk user_1 dan user_2
        const schedulesData = [
            {
                study_id: studyingDocs[0]._id,  // Studi untuk user_1
                activity_id: activityDocs[0]._id, // Aktivitas untuk user_1
                user_id: user_1._id,  // User pertama
            },
            {
                study_id: studyingDocs[1]._id,  // Studi untuk user_2
                activity_id: activityDocs[1]._id, // Aktivitas untuk user_2
                user_id: user_2._id,  // User kedua
            }
        ];
        await Schedule.insertMany(schedulesData);
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
