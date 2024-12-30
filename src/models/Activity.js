const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referensi ke User
    title: { type: String, required: true },
    description: { type: String, required: true },
    color_id: { type: mongoose.Schema.Types.ObjectId, ref: "Color", required: true },
    start_date_time: { type: Date, required: true }, // Simpan sebagai string, misalnya "08:00"
    end_date_time: { type: Date, required: true }   // Simpan sebagai string, misalnya "10:00"
  });
  
const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;