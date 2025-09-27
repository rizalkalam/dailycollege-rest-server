const mongoose = require("mongoose");

// const uri = "mongodb://localhost:27017";
// const dbName = "dailycollege";

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dailycollege";

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Keluar jika koneksi gagal
  }
};

module.exports = connectDB;
