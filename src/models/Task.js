const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referensi ke User
    name: { type: String, required: true },
    detail: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['belum_jalan', 'sedang_jalan', 'dalam_antrian', 'selesai'], 
        required: true 
    },
    priority: { 
        type: String, 
        enum: ['rendah', 'sedang', 'tinggi'], 
        required: true 
    },
    deadline: { type: Date, required: true }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
