const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PayrollSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  month: { type: String, required: true },
  year: { type: Number, required  : true },
  payslipPdfUrl: { type: String, required: true }, 
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', PayrollSchema);
