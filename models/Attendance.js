const mongoose =require('mongoose')
const DailyAttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  attendanceData: [
    {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
      empCode: String,
      name: String,
      role: String,
      dept: String,
      onOffSite: { type: String, enum: ['Onsite', 'Offsite', 'Both'], default: 'Onsite' },
      loginTime: String,
      logoutTime: String,
      status: { type: String, enum: ['None','Present','Leave','Holiday'], required: true },
      leaveType: { type: String, enum: ['None','CL','ML','PL','LOP',''], default: '' },
      totalWorkHrs: String,
      workType1: { type: String, enum: ['Regular','Week Off','Comp Off'], required: true },
      workType2: { type: String, enum: ['Regular','Week Off','Comp Off'], required: false },
      remarks: { type: String, default: '' },
      isEditing: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });
module.exports = mongoose.model('DailyAttendance', DailyAttendanceSchema);
