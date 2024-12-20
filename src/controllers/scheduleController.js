const { formatDateTime, addMinutesToDate } = require('../utils/dateHelper')
const Schedule = require('../models/Schedule');  // Pastikan path ke model Event benar

// Function untuk mendapatkan semua event berdasarkan user_id
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user_id: req.user_id });  // Ambil schedules berdasarkan user_id yang terautentikasi

    if (schedules.length === 0) {
        return res.status(200).json({ message: 'No schedules found for this user.', schedules });
    }

    res.status(200).json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getScheduleById = async (req, res) => {
    const userId = req.user_id;  // Ambil user_id dari request (hasil autentikasi)
    const scheduleId = req.params.id; // Ambil event_id dari URL parameter

    try {
        // Cari schedule berdasarkan user_id dan event_id
        const schedule = await Schedule.findOne({ _id: eventId, user_id: userId });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found or you do not have permission to view it.' });
        }

        // Jika schedule ditemukan, kirimkan data schedule
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const createSchedule = async (req, res) => {
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
            return res.status(400).json({ message: 'Reminder must be a positive number representing minutes before the schedule.' });
        }

        reminderDate = addMinutesToDate(startDateTime, reminder);
    }

    try {
        const newSchedule = new Schedule({
            user_id: userId,
            title,
            start_date_time: startDateTime,
            end_date_time: endDateTime,
            notes,
            reminder: reminderDate || null
        });

        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const updateSchedule = async (req, res) => {
    const userId = req.user_id;  // Ambil user_id dari request (hasil autentikasi)
    const scheduleId = req.params.id; // Ambil event_id dari URL parameter
    const { title, start_date, start_time, end_date, end_time, notes, reminder } = req.body;

    try {
         // Cari schedule berdasarkan event_id dan user_id
         const schedule = await Schedule.findOne({ _id: scheduleId, user_id: userId });

         if (!schedule) {
             return res.status(404).json({ message: 'Schedule not found or you are not authorized to update this schedule.' });
         }
 
         // Format tanggal dan waktu menggunakan helper (gunakan dayjs atau helper lainnya)
         const startDateTime = new Date(`${start_date}T${start_time}`);
         const endDateTime = new Date(`${end_date}T${end_time}`);
 
         // Update schedule dengan data baru
         schedule.title = title;
         schedule.start_date_time = startDateTime;
         schedule.end_date_time = endDateTime;
         schedule.notes = notes || schedule.notes;  // Jika catatan tidak ada, biarkan nilai lama
         if (reminder) {
             schedule.reminder = reminder;
         }
 
         const updatedSchedule = await schedule.save();
 
         res.status(200).json({
             message: 'Schedule updated successfully',
             schedule: updatedSchedule
         });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const deleteSchedule = async (req, res) => {
    const userId = req.user_id;  // Ambil user_id dari request (hasil autentikasi)
    const scheduleId = req.params.id; // Ambil event_id dari URL parameter

    try {
        // Cari event berdasarkan event_id dan user_id
        const schedule = await Schedule.findOneAndDelete({ _id: scheduleId, user_id: userId });

        // Jika event tidak ditemukan atau user tidak memiliki akses
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found or you are not authorized to delete this schedule.' });
        }

        // Kirimkan respons jika event berhasil dihapus
        res.status(200).json({
            message: 'Schedule deleted successfully',
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
