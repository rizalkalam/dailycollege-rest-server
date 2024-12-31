const { formatDateTime, addMinutesToDate } = require('../utils/dateHelper')
const Color = require("../models/Color");
const Day = require("../models/Days");
const Studying = require("../models/Studying");
const Activity = require("../models/Activity");

const getSchedules = async (req, res) => {
  try {
      // Ambil data jadwal belajar (Studying) berdasarkan user_id
      const studying = await Studying.find({ user_id: req.user._id })
          .populate({ path: 'color_id', select: 'color_name color_value' })
          .populate({ path: 'day_id', select: 'name' });

      // Ambil data aktivitas (Activity) berdasarkan user_id
      const activities = await Activity.find({ user_id: req.user._id })
          .populate({ path: 'color_id', select: 'color_name color_value' })
          .populate({ path: 'day_id', select: 'name' });

      // Gabungkan data Studying dan Activity menjadi satu array
      const formattedSchedules = [
          ...studying.map(study => ({
              _id: study._id,
              user_id: study.user_id,
              title: study.title,
              day: study.day_id.name,
              start_time: study.start_time,
              end_time: study.end_time,
              place: study.place,
              room: study.room,
              color: {
                  name: study.color_id.color_name,
                  value: study.color_id.color_value,
              },
          })),
          ...activities.map(activity => ({
              _id: activity._id,
              user_id: activity.user_id,
              title: activity.title,
              description: activity.description,
              day: activity.day_id.name,
              start_time: activity.start_time,
              end_time: activity.end_time,
              color: {
                  name: activity.color_id.color_name,
                  value: activity.color_id.color_value,
              },
          })),
        ];

        if (formattedSchedules.length === 0) {
            return res.status(200).json({ message: 'Jadwal kosong', schedules: [] });
        }

        res.status(200).json(formattedSchedules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};

const deleteScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah ID ada di koleksi Activity
    const activity = await Activity.findById(id);
    if (activity) {
      await activity.deleteOne();
      return res.status(200).json({ message: 'Data activity berhasil dihapus.' });
    }

    // Cek apakah ID ada di koleksi Study
    const study = await Studying.findById(id);
    if (study) {
      await study.deleteOne();
      return res.status(200).json({ message: 'Data study berhasil dihapus.' });
    }

    // Jika ID tidak ditemukan di kedua koleksi
    return res.status(404).json({ message: 'Data dengan ID tersebut tidak ditemukan.' });
  } catch (error) {
    console.error('Kesalahan saat menghapus data:', error);
    res.status(500).json({ message: 'Kesalahan server.' });
  }
};

// const getScheduleById = async (req, res) => {
//     const userId = req.user_id;  // Ambil user_id dari request (hasil autentikasi)
//     const scheduleId = req.params.id; // Ambil event_id dari URL parameter

//     try {
//         // Cari schedule berdasarkan user_id dan event_id
//         const schedule = await Schedule.findOne({ _id: scheduleId, user_id: userId });

//         if (!schedule) {
//             return res.status(404).json({ message: 'Schedule not found or you do not have permission to view it.' });
//         }

//         // Jika schedule ditemukan, kirimkan data schedule
//         res.status(200).json(schedule);
//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// }

module.exports = {
  getSchedules,
  deleteScheduleById,
};
