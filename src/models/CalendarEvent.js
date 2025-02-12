const mongoose = require('mongoose');  

const calendarEventSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    note: {type: String, required: true},
    location: {type: String, required: true},
    reminderTime: {type: Number, required: true},
    color_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
})

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);