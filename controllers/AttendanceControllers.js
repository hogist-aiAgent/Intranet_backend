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
exports.getMonthlyAttendanceSummaryCustom = async (req, res) => {
  try {
    const { empCode, monthName, year, gender } = req.body;

    if (!empCode || !monthName || !year || !gender) {
      return res.status(400).json({ message: 'empCode, monthName, year and gender are required in body' });
    }

    const monthMap = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };

    const currentMonthNumber = monthMap[monthName.toLowerCase()];
    if (currentMonthNumber === undefined) {
      return res.status(400).json({ message: 'Invalid month name provided' });
    }

    let startMonth = currentMonthNumber - 1;
    let startYear = year;

    if (startMonth < 0) {
      startMonth = 11;
      startYear = year - 1;
    }

    const startDate = new Date(startYear, startMonth, 28, 0, 0, 0);
    const endDate = new Date(year, currentMonthNumber, 27, 23, 59, 59);

    const records = await DailyAttendance.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      "attendanceData.empCode": empCode
    });

    let presentDays = 0;
    let absentDays = 0;
    let clTaken = 0;
    let lopTaken = 0;
    let mlTaken = 0;

    records.forEach(day => {
      const employeeRecord = day.attendanceData.find(a => a.empCode === empCode);
      if (employeeRecord) {
        if (employeeRecord.status === 'Present') {
          presentDays++;
        }
        if (employeeRecord.leaveType === 'CL') {
          clTaken++;
        }
        if (employeeRecord.leaveType === 'LOP') {
          lopTaken++;
        }
        if (employeeRecord.leaveType === 'ML') {
          mlTaken++;
        }
        if (employeeRecord.status === 'Leave') {
          absentDays++;
        }
      }
    });

    const clBalance = Math.max(1 - clTaken, 0);
    const mlBalance = gender.toLowerCase() === 'female' ? Math.max(1 - mlTaken, 0) : 0;

    return res.status(200).json({
      empCode,
      gender,
      month: monthName,
      year,
   cycle: `${startDate.getFullYear()}-${String(startDate.getMonth()+1).padStart(2,'0')}-${String(startDate.getDate()).padStart(2,'0')} to ${endDate.getFullYear()}-${String(endDate.getMonth()+1).padStart(2,'0')}-${String(endDate.getDate()).padStart(2,'0')}`
,
      summary: {
        presentDays,
        absentDays,
        clTaken,
        clBalance,
        lopTaken,
        mlTaken,
        mlBalance
      }
    });

  } catch (err) {
    console.error('Get monthly attendance summary error:', err);
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

exports.getAttendanceByEmployeeId = async (req, res) => {
  try {
    const { empCode, month, year } = req.body;

    if (!empCode || !month || !year) {
      return res.status(400).json({ message: 'empCode, month, and year are required' });
    }

    const monthNum = parseInt(month, 10) - 1; // JS months are 0-based
    const startDate = new Date(year, monthNum, 1);
    const endDate = new Date(year, monthNum + 1, 0, 23, 59, 59); // end of the month

    const records = await DailyAttendance.find({
      date: { $gte: startDate, $lte: endDate },
      "attendanceData.empCode": empCode
    });

    const attendance = records.map((record) => {
      const emp = record.attendanceData.find(e => e.empCode === empCode);

      return {
        date: record.date.toISOString().split("T")[0],
        status: emp.status,
        loginTime: emp.loginTime,
        logoutTime: emp.logoutTime,
        totalWorkHrs: emp.totalWorkHrs,
        onOffSite: emp.onOffSite,
        leaveType: emp.leaveType,
        workType1: emp.workType1,
        workType2: emp.workType2,
        remarks: emp.remarks
      };
    });

    return res.status(200).json({
      status: "Success",
      empCode,
      month,
      year,
      totalDays: attendance.length,
      attendance
    });

  } catch (err) {
    console.error("Get attendance by employee error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// http://localhost:7002/api/attendance/delete-employee -patch
// {
//   "date": "2025-06-28T00:00:00.000Z",
//   "empCode": "Emp027"
// }