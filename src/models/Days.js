const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
    name: { type: String, required: true } // Contoh: 'Senin', 'Selasa', dll.
});

module.exports = mongoose.model('Day', daySchema);