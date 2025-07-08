const Payroll = require('../models/Payroll');
const Staff = require('../models/Staff');

// CREATE
exports.createPayroll = async (req, res) => {
  try {
    const { employeeId, month, year, payslipPdfUrl } = req.body;

    const employee = await Staff.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const payroll = new Payroll({
      employee: employee['_id'],
      month,
      year,
      payslipPdfUrl
    });

    await payroll.save();
    return res.json({ success: true, payroll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// READ all
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate('employee', 'employeeId staffName department')
      .sort({ uploadedAt: -1 });
    res.json(payrolls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// READ by employeeId
exports.getPayrollsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Staff.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const payrolls = await Payroll.find({ employee: employee._id })
      .populate('employee', 'employeeId staffName')
      .sort({ uploadedAt: -1 });

    res.json(payrolls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
exports.updatePayroll = async (req, res) => {
  try {
    const { month, year, payslipPdfUrl } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ error: "Payroll not found" });
    }

    if (month) payroll.month = month;
    if (year) payroll.year = year;
    if (payslipPdfUrl) payroll.payslipPdfUrl = payslipPdfUrl;

    await payroll.save();
    res.json({ success: true, payroll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
exports.deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) {
      return res.status(404).json({ error: "Payroll not found" });
    }
    res.json({ success: true, message: "Payroll deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
