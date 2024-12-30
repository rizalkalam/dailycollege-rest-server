const mongoose = require("mongoose");

const daysSchema = new mongoose.Schema({
    name: { type: String, required: true }
  });
  
const Day = mongoose.model("Day", daysSchema);
module.exports = Day;
  