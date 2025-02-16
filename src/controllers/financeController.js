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

module.exports = { getFinance }