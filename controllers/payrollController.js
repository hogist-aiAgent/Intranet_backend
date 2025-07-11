const Payroll = require('../models/Payroll');
const Staff = require('../models/Staff');

exports.createPayroll = async (req, res) => {
  try {
    const { employeeId, month, year, payslipPdfUrl, staffName } = req.body;

    // Find employee _id by employeeId
    const employee = await Staff.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if payroll for this employee + month + year already exists
    const existingPayroll = await Payroll.findOne({
      employee: employee._id,
      month,
      year,
    });

    if (existingPayroll) {
      return res.status(400).json({ error: `Payroll for month "${month}" and year "${year}" already exists for this employee.` });
    }

    // Create new payroll
    const payroll = new Payroll({
      employee: employee._id,
      month,
      year,
      payslipPdfUrl,
      uploadedAt: new Date(),
      staffName // optional if you want to store it separately
    });

    await payroll.save();

    res.status(201).json(payroll);
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

    // Flatten the employee object into each payroll entry
    const flattenedPayrolls = payrolls.map((payroll) => ({
      _id: payroll._id,
      employeeId: payroll.employee?.employeeId || '',
      staffName: payroll.employee?.staffName || '',
      month: payroll.month,
      year: payroll.year,
      payslipPdfUrl: payroll.payslipPdfUrl,
      uploadedAt: payroll.uploadedAt,
      __v: payroll.__v
    }));

    res.json(flattenedPayrolls);
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
