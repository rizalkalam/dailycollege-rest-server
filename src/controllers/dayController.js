const daysOfWeek = require('../models/Days');  

const getDays = async (req, res) => {
    res.status(200).json(daysOfWeek); 
};

module.exports = { getDays };
