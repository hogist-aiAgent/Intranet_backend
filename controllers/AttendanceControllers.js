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
// exports.getAttendanceByDate = async (req, res) => {
//   try {
//     const { date } = req.params;
//     const start = new Date(date);


//     const records = await DailyAttendance.find({
//       date: start
//     });

//     res.status(200).json({
//         status:"Data are got successfully",
//         data:records
//     });
//   } catch (err) {
//     console.error('Fetch error:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
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
  empCode: emp.employeeId,
  name: emp.staffName,
  role: emp.role,
  dept: emp.department,
  onOffSite: emp.jobType ,            
  loginTime: '',
  logoutTime: '',   
  status: 'None',               
  leaveType: 'None',              
  totalWorkHrs: '',
  workType1: 'Regular',            
  workType2: 'Regular',            
  remarks: '',
  isEditing: false
}))||[];
console.log(start,'start')
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