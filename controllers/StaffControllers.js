const Staff = require('./../models/Staff');
const DailyAttendance =require('./../models/Attendance')

exports.createStaff = async (req, res) => {
  try {
    // Create the staff
    const staff = new Staff(req.body);
    await staff.save();

    const today = new Date();

const dateOnly = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));


    const attendanceEntry = {
       staff: staff._id,
      empCode: staff.employeeId,
      name: staff.staffName,
      role: staff.role,
      dept: staff.department,
      onOffSite: staff.jobType,
      loginTime: '',
      logoutTime: '',
      status: 'None',
      leaveType: 'None',
      totalWorkHrs: '',
      workType1: 'Regular',
      workType2: 'Regular',
      remarks: '',
      isEditing: false
    };
    let dailyAttendance = await DailyAttendance.findOne({ date: dateOnly });
    if (!dailyAttendance) {
      // create new attendance document
      dailyAttendance = new DailyAttendance({
        date: dateOnly,
        attendanceData: [attendanceEntry]
      });
    } else {

      dailyAttendance.attendanceData.push(attendanceEntry);
    }

    await dailyAttendance.save();

    res.status(201).json({
      message: "Created Successfully",
      data: staff
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateStaff = async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Staff not found' });
    res.json({
        "message":"Updated Successfully",
        "data":updated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Staff not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
