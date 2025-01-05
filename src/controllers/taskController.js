const Task = require("../models/Task");

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('user_id'); // Mengambil semua tugas dan populasi user_id

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
            data: formattedTasks,
        });
    } catch (error) {
        console.error('Kesalahan mengambil tugas:', error);
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
        task.name = name;
        task.detail = detail;
        task.status = status;
        task.priority = priority;
        task.deadline = deadline;

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