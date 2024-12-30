const mongoose = require("mongoose");

const studyingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referensi ke User
    title: { type: String, required: true },
    place: { type: String, required: true },
    room: { type: String, required: true },
    color_id: { type: mongoose.Schema.Types.ObjectId, ref: "Color", required: true },
    start_date_time: { type: Date, required: true }, // Simpan sebagai string, misalnya "08:00"
    end_date_time: { type: Date, required: true }   // Simpan sebagai string, misalnya "10:00"
  });
  
const Studying = mongoose.model("Studying", studyingSchema);
module.exports = Studying;