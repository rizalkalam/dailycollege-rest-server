// seeders/financialSeeder.js  
const mongoose = require('mongoose');  
const FinancialRecord = require('../models/FinancialRecord'); // Path ke model FinancialRecord Anda  
const User = require('../models/User'); // Path ke model User Anda  
const connectDB = require('../config/database'); // Path ke file koneksi database  
  
const seedFinancialRecords = async () => {  
    try {  
        // Hubungkan ke database  
        await connectDB();  
        console.log('Koneksi ke database berhasil');  
  
        // Hapus data yang ada (opsional)  
        await FinancialRecord.deleteMany({});  
  
        // Mencari pengguna  
        const user_1 = await User.findOne({ email: 'nugasyukmyid@gmail.com' });  
        const user_2 = await User.findOne({ email: 'adesetiawan@gmail.com' });  
  
        if (!user_1 || !user_2) {  
            console.log("Pengguna yang diperlukan tidak ditemukan!");  
            return;  
        }  
  
        // Data contoh untuk user_1  
        const financialRecords = [  
            { user_id: user_1._id, amount: 1500000, category: 'Uang Masuk', detail: 'Gaji Bulanan', date: new Date('2024-12-01'), type: 'income' },  
            { user_id: user_1._id, amount: 500000, category: 'Belanja', detail: 'Belanja Bulanan', date: new Date('2024-12-05'), type: 'expense' },  
            { user_id: user_1._id, amount: 200000, category: 'Topup', detail: 'Topup E-Wallet', date: new Date('2024-12-10'), type: 'expense' },  
            { user_id: user_1._id, amount: 100000, category: 'Lainnya', detail: 'Pengeluaran Tak Terduga', date: new Date('2024-12-15'), type: 'expense' },  
        ];  
  
        // Data contoh untuk user_2  
        const financialRecordsUser2 = [  
            { user_id: user_2._id, amount: 500000, category: 'Uang Masuk', detail: 'Bonus', date: new Date('2024-12-02'), type: 'income' },  
            { user_id: user_2._id, amount: 300000, category: 'Belanja', detail: 'Makanan', date: new Date('2024-12-06'), type: 'expense' },  
            { user_id: user_2._id, amount: 150000, category: 'Topup', detail: 'Topup Pulsa', date: new Date('2024-12-12'), type: 'expense' },  
            { user_id: user_2._id, amount: 250000, category: 'Lainnya', detail: 'Pengeluaran Hiburan', date: new Date('2024-12-20'), type: 'expense' },  
        ];  
  
        // Gabungkan kedua array catatan keuangan  
        const allFinancialRecords = [...financialRecords, ...financialRecordsUser2];  
  
        // Simpan data ke database  
        await FinancialRecord.insertMany(allFinancialRecords);  
        console.log('Data catatan keuangan berhasil disimpan');  
  
    } catch (error) {  
        console.error('Kesalahan saat seeding data:', error);  
    } finally {  
        // Tutup koneksi  
        mongoose.connection.close();  
    }  
};  
  
// Jalankan fungsi seeder  
seedFinancialRecords();  
