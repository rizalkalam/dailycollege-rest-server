const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Event schema definition
const eventSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a 'User' model
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  start_date_time: {
    type: Date,
    required: true,
  },
  end_date_time: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    trim: true,
  },
  reminder: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;