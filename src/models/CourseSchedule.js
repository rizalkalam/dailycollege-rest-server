const mongoose = require('mongoose');  
  
const courseScheduleSchema = new mongoose.Schema({  
    day_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Day', required: true },
    subject: { type: String, required: true },  
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    location: { type: String, required: true },  
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});  
  
module.exports = mongoose.model('CourseSchedule', courseScheduleSchema);  