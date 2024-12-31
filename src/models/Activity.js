const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referensi ke User
    title: { type: String, required: true },
    description: { type: String, required: true },
    color_id: { type: mongoose.Schema.Types.ObjectId, ref: "Color", required: true },
    day_id: { type: mongoose.Schema.Types.ObjectId, ref: "Day", required: true },
    start_time: { type: String, required: true, match: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/ }, // Format HH:mm
    end_time: { type: String, required: true, match: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/ }   // Format HH:mm
  });
  
const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;