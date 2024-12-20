// src/utils/dateHelper.js
const dayjs = require('dayjs');

const formatDateTime = (date, time) => {
    // Menggabungkan tanggal dan waktu
    return dayjs(`${date} ${time}`).toDate();
};

const addMinutesToDate = (date, minutes) => {
    // Menambah atau mengurangi menit pada suatu tanggal
    return dayjs(date).subtract(minutes, 'minute').toDate();
};

module.exports = {
    formatDateTime,
    addMinutesToDate
};
