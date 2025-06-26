const mongoose =require('mongoose')
const DailyAttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  attendanceData: [
    {
      empCode: String,
      name: String,
      role: String,
      dept: String,
      onOffSite: { type: String, enum: ['On Site','Off Site','Both'], default: 'On Site' },
      loginTime: String,
      logoutTime: String,
      status: { type: String, enum: ['Present','Leave','Holiday'], required: true },
      leaveType: { type: String, enum: ['None','CL','ML','PL','LOP',''], default: '' },
      totalWorkHrs: String,
      workType1: { type: String, enum: ['Regular','Week Off','Comp Off'], required: true },
      workType2: { type: String, enum: ['Regular','Week Off','Comp Off'], required: true },
      remarks: { type: String, default: '' },
      isEditing: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });
module.exports = mongoose.model('DailyAttendance', DailyAttendanceSchema);
