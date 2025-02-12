const mongoose = require('mongoose');
const CalendarEvent = require('../models/CalendarEvent'); // Pastikan path ini sesuai dengan struktur folder Anda
const Color = require('../models/Color');
const User = require('../models/User'); // Model User untuk referensi user_id
const connectDB = require('../config/database'); // Path ke file koneksi database

const seedCalendarEvent = async () => {
    try {
        await connectDB();       
        console.log('Seeding calendar events...');

        await CalendarEvent.deleteMany({});

        const user_1 = await User.findOne({ email: 'nugasyukmyid@gmail.com' });
        const user_2 = await User.findOne({ email: 'adesetiawan@gmail.com' });
        const color_1 = await Color.findOne({ color_name: 'Red' });
        const color_2 = await Color.findOne({ color_name: 'Yellow' });

        if (!user_1 || !user_2 || !color_1 || !color_2) {
            console.log("Pengguna atau warna yang diperlukan tidak ditemukan!");
            return;
        }

        const calendarEvents = [
            {
                user_id: user_1, // Menggunakan user pertama
                title: 'Meeting with Team',
                startDate: new Date('2025-02-15'),
                endDate: new Date('2025-02-15'),
                startTime: '10:00',
                endTime: '11:00',
                note: 'Discuss project updates',
                location: 'Conference Room A',
                reminderTime: 30, // Reminder 30 menit sebelum
                color_id: color_1 // Menggunakan color pertama
            },
            {
                user_id: user_2, // Menggunakan user kedua
                title: 'Doctor Appointment',
                startDate: new Date('2025-02-16'),
                endDate: new Date('2025-02-16'),
                startTime: '14:00',
                endTime: '15:00',
                note: 'Annual check-up',
                location: 'Health Clinic',
                reminderTime: 60, // Reminder 1 jam sebelum
                color_id: color_2 // Menggunakan color kedua
            },
            {
                user_id: user_2, // Menggunakan user pertama
                title: 'Project Deadline',
                startDate: new Date('2025-02-20'),
                endDate: new Date('2025-02-20'),
                startTime: '05:00',
                endTime: '05:30',
                note: 'Submit final project report',
                location: 'N/A',
                reminderTime: 1440, // Reminder 1 hari sebelum
                color_id: color_1 // Menggunakan color ketiga
            }
        ];

        await CalendarEvent.insertMany(calendarEvents);
        console.log('Calendar events seeded successfully!');
    } catch (error) {
        console.error('Kesalahan saat seeding data:', error);        
    } finally {
        mongoose.connection.close();
    }
}

seedCalendarEvent();