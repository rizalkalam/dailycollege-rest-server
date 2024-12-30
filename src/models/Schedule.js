const mongoose = require('mongoose');
const schedulesSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referensi ke User
  study_id: { type: mongoose.Schema.Types.ObjectId, ref: "Studying", required: true },
  activity_id: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true }
});

const Schedule = mongoose.model("Schedule", schedulesSchema);
module.exports = Schedule;