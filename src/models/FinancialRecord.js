const mongoose = require('mongoose');  
  
const financialRecordSchema = new mongoose.Schema({  
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    amount: { type: Number, required: true },  
     category: {  
        type: String,  
        enum: ['Uang Masuk', 'Belanja', 'Topup', 'Lainnya'],  
        required: true  
    },  
    detail: { type: String, required: true },  
    date: { type: Date, default: Date.now },  
    type: { type: String, enum: ['income', 'expense'], required: true }  
});  
  
module.exports = mongoose.model('FinancialRecord', financialRecordSchema);  
