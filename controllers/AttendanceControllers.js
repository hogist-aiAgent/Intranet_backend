const DailyAttendance = require('../models/Attendance');
const Staff = require('../models/Staff');
exports.bulkUpsertAttendance = async (req, res) => {
  try {
    const { date, attendanceData } = req.body;

    if (!date || !Array.isArray(attendanceData)) {
      return res.status(400).json({ message: 'date and attendanceData array are required' });
    }

    const result = await DailyAttendance.findOneAndUpdate(
      { date: new Date(date) },
      { $set: { attendanceData } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Daily attendance saved/updated', result });
  } catch (err) {
    console.error('Bulk upsert error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const start = new Date(date);
    ;
//     const { date } = req.params;
// const start = new Date(date);
    let record = await DailyAttendance.findOne({ date: start });
 const records = await DailyAttendance.find({
   date: start
 });
 console.log(records,"records")
    const today = new Date().toISOString().split('T')[0];
    if (!record && date === today) {
     
      const staffList = await Staff.find({}, 'employeeId staffName role department jobType');
 const attendanceData = staffList.map((emp) => ({
  staff: emp.staff,
  empCode: emp.employeeId,
  name: emp.staffName,
  role: emp.role,
  dept: Array.isArray(emp.department) ? emp.department.join(', ') : emp.department,
  onOffSite: emp.jobType,
  loginTime: '',
  logoutTime: '',
  status: 'None',
  leaveType: 'None',
  totalWorkHrs: '',
  workType1: 'Regular',
  workType2: 'Regular',
  remarks: '',
  isEditing: false
})) || [];


      record = await DailyAttendance.create({
        date: start,
        attendanceData
      });
    }

    return res.status(200).json({
      status: 'Success',
      data: record ? [record] : []
    });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteEmployeeAttendance = async (req, res) => {
  try {
    const { date, empCode } = req.body;

    if (!date || !empCode) {
      return res.status(400).json({ message: 'date and empCode are required' });
    }

    const formattedDate = new Date(date);

    const updatedRecord = await DailyAttendance.findOneAndUpdate(
      { date: formattedDate },
      { $pull: { attendanceData: { empCode } } },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: 'No attendance record found for this date or employee' });
    }

    return res.status(200).json({
      message: `Attendance record for ${empCode} on ${date} deleted successfully`,
      data: updatedRecord
    });

  } catch (err) {
    console.error('Delete employee attendance error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//http://localhost:7002/api/attendance/delete-employee -patch
// {
//   "date": "2025-06-28T00:00:00.000Z",
//   "empCode": "Emp027"
// }