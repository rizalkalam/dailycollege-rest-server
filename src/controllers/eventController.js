const { formatDateTime, addMinutesToDate } = require('../utils/dateHelper')
const Event = require('../models/Event');  // Pastikan path ke model Event benar

// Function untuk mendapatkan semua event berdasarkan user_id
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user_id: req.user_id });  // Ambil events berdasarkan user_id yang terautentikasi

    if (events.length === 0) {
        return res.status(200).json({ message: 'No events found for this user.', events });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getEventById = async (req, res) => {
    const userId = req.user_id;  // Ambil user_id dari request (hasil autentikasi)
    const eventId = req.params.id; // Ambil event_id dari URL parameter

    try {
        // Cari event berdasarkan user_id dan event_id
        const event = await Event.findOne({ _id: eventId, user_id: userId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or you do not have permission to view it.' });
        }

        // Jika event ditemukan, kirimkan data event
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const createEvent = async (req, res) => {
    const { title, start_date, start_time, end_date, end_time, notes, reminder } = req.body;
    const userId = req.user_id;

    if (!title || !start_date || !start_time || !end_date || !end_time) {
        return res.status(400).json({ message: 'Title, start date, start time, end date, and end time are required.' });
    }

    // Gunakan helper untuk memformat start_date dan start_time
    const startDateTime = formatDateTime(start_date, start_time);
    const endDateTime = formatDateTime(end_date, end_time);

    let reminderDate;
    if (reminder) {
        if (isNaN(reminder) || reminder <= 0) {
            return res.status(400).json({ message: 'Reminder must be a positive number representing minutes before the event.' });
        }

        reminderDate = addMinutesToDate(startDateTime, reminder);
    }

    try {
        const newEvent = new Event({
            user_id: userId,
            title,
            start_date_time: startDateTime,
            end_date_time: endDateTime,
            notes,
            reminder: reminderDate || null
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const updateEvent = async (req, res) => {
    const userId = req.user_id;  // Ambil user_id dari request (hasil autentikasi)
    const eventId = req.params.id; // Ambil event_id dari URL parameter
    const { title, start_date, start_time, end_date, end_time, notes, reminder } = req.body;

    try {
         // Cari event berdasarkan event_id dan user_id
         const event = await Event.findOne({ _id: eventId, user_id: userId });

         if (!event) {
             return res.status(404).json({ message: 'Event not found or you are not authorized to update this event.' });
         }
 
         // Format tanggal dan waktu menggunakan helper (gunakan dayjs atau helper lainnya)
         const startDateTime = new Date(`${start_date}T${start_time}`);
         const endDateTime = new Date(`${end_date}T${end_time}`);
 
         // Update event dengan data baru
         event.title = title;
         event.start_date_time = startDateTime;
         event.end_date_time = endDateTime;
         event.notes = notes || event.notes;  // Jika catatan tidak ada, biarkan nilai lama
         if (reminder) {
             event.reminder = reminder;
         }
 
         const updatedEvent = await event.save();
 
         res.status(200).json({
             message: 'Event updated successfully',
             event: updatedEvent
         });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const deleteEvent = async (req, res) => {
    const userId = req.user_id;  // Ambil user_id dari request (hasil autentikasi)
    const eventId = req.params.id; // Ambil event_id dari URL parameter

    try {
        // Cari event berdasarkan event_id dan user_id
        const event = await Event.findOneAndDelete({ _id: eventId, user_id: userId });

        // Jika event tidak ditemukan atau user tidak memiliki akses
        if (!event) {
            return res.status(404).json({ message: 'Event not found or you are not authorized to delete this event.' });
        }

        // Kirimkan respons jika event berhasil dihapus
        res.status(200).json({
            message: 'Event deleted successfully',
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
