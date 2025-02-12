const mongoose = require('mongoose');
const connectDB = require('../config/database'); // Path ke file koneksi database
const Color = require('../models/Color');

const colors = [
    { color_name: "Red", color_value: "#FF4545" },
    { color_name: "Orange", color_value: "#F98825" },
    { color_name: "Yellow", color_value: "#F8BD00" },
    { color_name: "Green", color_value: "#95E7AF" },
    { color_name: "Blue", color_value: "#5874FF" },
    { color_name: "Purple", color_value: "#9747FF" },
    { color_name: "Beige", color_value: "#FEA88A" },
    { color_name: "orangeSecondary", color_value: "#FFB567" },
    { color_name: "Pink", color_value: "#FF679C" },
  ];
  

const seedColor = async () => {
    try {
        await connectDB();       
        console.log('Seeding calendar events...');

        await Color.deleteMany({});

        await Color.insertMany(colors);
        console.log("Colors seeded successfully.");
    } catch (error) {
        console.error("Error seeding colors:", error);
    } finally {
        // Tutup koneksi
        mongoose.connection.close();
    }
}

seedColor()