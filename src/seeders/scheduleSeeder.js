const mongoose = require('mongoose');
const connectDB = require('../config/database'); // Path ke file koneksi database
const Schedule = require('../models/Schedule'); // Pastikan path ke model Event benar
const User = require('../models/User'); // Pastikan path ke model User benar

async function seedSchedules() {
    try {
        // Hubungkan ke database
        await connectDB();

        console.log('Seeding shcedules...');
      // Menemukan pengguna pertama, untuk contoh ini kita gunakan user dengan email "kalam@example.com"
      const user = await User.findOne({ email: 'nugasyukmyid@gmail.com' });
  
      if (!user) {
        console.log('User not found. Please create a user first.');
        return;
      }

      // Hapus semua data pengguna (opsional)
      await Schedule.deleteMany();
  
      // Data shcedules sampel
      const shcedules = [
        {
          user_id: user._id,
          title: 'Meeting with Team',
          start_date_time: new Date('2024-12-22T10:00:00Z'),
          end_date_time: new Date('2024-12-22T12:00:00Z'),
          note: 'Discuss project progress and upcoming tasks.',
          reminder: new Date('2024-12-22T09:30:00Z'),
        },
        {
          user_id: user._id,
          title: 'Doctor Appointment',
          start_date_time: new Date('2024-12-23T14:00:00Z'),
          end_date_time: new Date('2024-12-23T14:30:00Z'),
          note: 'Regular health check-up.',
          reminder: new Date('2024-12-23T13:30:00Z'),
        },
        {
          user_id: user._id,
          title: 'Conference Presentation',
          start_date_time: new Date('2024-12-25T09:00:00Z'),
          end_date_time: new Date('2024-12-25T11:00:00Z'),
          note: 'Present the final project to the conference attendees.',
          reminder: new Date('2024-12-25T08:30:00Z'),
        },
      ];
  
      // Insert shcedules ke dalam database
      await Schedule.insertMany(shcedules);
      console.log('Shcedules seeded successfully!');
      mongoose.connection.close();
    } catch (err) {
      console.log('Error seeding shcedules:', err);
      mongoose.connection.close();
    }
  }

  seedSchedules();