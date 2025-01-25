const mongoose = require('mongoose');  
  
const courseScheduleSchema = new mongoose.Schema({  
    day: { type: String, required: true },  
    subject: { type: String, required: true },  
    time: { type: String, required: true },  
    location: { type: String, required: true },  
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});  
  
module.exports = mongoose.model('CourseSchedule', courseScheduleSchema);  