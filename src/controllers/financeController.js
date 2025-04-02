const Finance = require('../models/FinancialRecord');

const getFinance = async (req, res) => {
    try {
        const userId = req.user._id;

        // Validasi user ID
        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'User ID tidak ditemukan'
            });
        }

        // Ambil semua data finance untuk user
        const financialData = await Finance.find({ user_id: userId });

        // Hitung total income dan expense
        const summary = financialData.reduce((acc, curr) => {
            if (curr.type === 'income') {
                acc.totalIncome += curr.amount;
            } else if (curr.type === 'expense') {
                acc.totalExpense += curr.amount;
            }
            return acc;
        }, { totalIncome: 0, totalExpense: 0 });

        // Hitung balance
        const balance = summary.totalIncome - summary.totalExpense;

        // Format response
        res.status(200).json({
            data: {
                // transactions: financialData,
                totalIncome: summary.totalIncome,
                totalExpense: summary.totalExpense,
                balance: balance
            }
        });

    } catch (error) {
        console.error('Error getting finance data:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data keuangan'
        });
    }
};

const addFinancialRecord = async (req, res) => {
    try {
        const { amount, category, type, detail } = req.body;

        const newRecord = new Finance({
            user_id: req.user._id, // ID user dari token JWT
            amount,
            category,
            type,
            detail: detail || '',
            date: new Date()
        });

        const savedRecord = await newRecord.save();

        return res.status(201).json({
            status: true,
            message: 'Data keuangan berhasil ditambahkan',
            data: savedRecord
        });

    } catch (error) {
        console.error('Error saving financial record:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: false,
                message: `Terjadi kesalahan validasi: ${error.message}`,
                data: null
            });
        }

        return res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan server',
            data: null
        });
    }
};

const getHistory = async (req, res) => {
    try {
        const { 
            category, 
            month,
            page = 1,
            limit = 20
        } = req.query;

        // Buat query filter
        const filter = {
            user_id: req.user._id
        };

        // Filter berdasarkan category
        if (category) {
            filter.category = category;
        }

        // Filter berdasarkan bulan
        if (month) {
            const [year, monthNum] = month.split('-');
            const startDate = new Date(year, monthNum - 1, 1);
            const endDate = new Date(year, monthNum, 0);
            
            filter.date = {
                $gte: startDate,
                $lte: endDate
            };
        }

        // Hitung total data untuk pagination
        const totalData = await Finance.countDocuments(filter);
        const totalPages = Math.ceil(totalData / limit);

        // Ambil data dengan pagination
        const transactions = await Finance.find(filter)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        return res.status(200).json({
            status: true,
            message: 'Data riwayat transaksi berhasil diambil',
            data: {
                transactions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalData,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching transaction history:', error);
        return res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan saat mengambil data riwayat transaksi',
            data: null
        });
    }
}

module.exports = { getFinance, addFinancialRecord, getHistory }