const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Jika menggunakan password lokal
    googleId: { type: String, required: false, sparse: true },  // Memungkinkan googleId null
    avatar: { type: String, required: false }, // Menyimpan avatar pengguna
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
