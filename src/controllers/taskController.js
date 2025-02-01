const Task = require("../models/Task");

const getTasks = async (req, res) => {
    try {
        const { status } = req.query; // Mengambil parameter status dari query

        let tasks;

        // Jika parameter status ada dan tidak kosong, filter berdasarkan status
        if (status) {
            tasks = await Task.find({ status: { $ne: 'selesai' } }).populate('user_id');
        } else {
            // Jika parameter status kosong, ambil semua tugas
            tasks = await Task.find().populate('user_id');
        }

        // Memformat hasil
        const formattedTasks = tasks.map(task => ({
            _id: task._id,
            name: task.name,
            detail: task.detail,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline
        }));

        res.status(200).json({
            message: 'Daftar tugas berhasil diambil.',
            data: formattedTasks
        });
    } catch (error) {
        console.error('Kesalahan saat mengambil tugas:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params; // Mengambil ID dari parameter URL
        const task = await Task.findById(id).populate('user_id'); // Mencari tugas berdasarkan ID dan populasi user_id

        if (!task) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
        }

        res.status(200).json({
            message: 'Tugas berhasil diambil.',
            data: task,
        });
    } catch (error) {
        console.error('Kesalahan mengambil tugas:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};

const createTask = async (req, res) => {
    try {
        const { name, detail, status, priority, deadline } = req.body;

        if (!name || !detail || !status || !priority || !deadline){
            return res.status(400).json({ message: 'Semua input data harus diisi.' });
        }

        const newTask = new Task({
            name,
            detail,
            status,
            priority,
            deadline,
            user_id: req.user._id
        })

        const savedTask = await newTask.save();

        res.status(201).json({
            message: 'Tugas berhasil dibuat.',
            data: savedTask,
        });
    } catch (error) {
        console.error('Kesalahan membuat tugas:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
}

const editTask = async (req, res) => {
    try {
        const { id } = req.params; // Mengambil ID dari parameter URL
        const { name, detail, status, priority, deadline } = req.body;

        // Validasi input
        if (!name || !detail || !status || !priority || !deadline) {
            return res.status(400).json({ message: 'Semua input data harus diisi.' });
        }

        // Mencari tugas berdasarkan ID
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
        }

        // Memperbarui data tugas
        if (name !== undefined) task.name = name;  
        if (detail !== undefined) task.detail = detail;  
        if (status !== undefined) task.status = status;  
        if (priority !== undefined) task.priority = priority;  
        if (deadline !== undefined) task.deadline = deadline;  

        // Menyimpan perubahan
        const updatedTask = await task.save();

        res.status(200).json({
            message: 'Tugas berhasil diperbarui.',
            data: updatedTask,
        });
    } catch (error) {
        console.error('Kesalahan memperbarui tugas:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params; // Mengambil ID dari parameter URL

        // Mencari tugas berdasarkan ID dan menghapusnya
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
        }

        res.status(200).json({
            message: 'Tugas berhasil dihapus.',
            data: task,
        });
    } catch (error) {
        console.error('Kesalahan menghapus tugas:', error);
        res.status(500).json({ message: 'Kesalahan server.' });
    }
};

module.exports = { getTasks, getTaskById, createTask, editTask, deleteTask }