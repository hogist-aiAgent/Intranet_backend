const express = require('express');
const router = express.Router();
const attendanceController = require('./../controllers/AttendanceControllers');

router.post('/bulk-upsert', attendanceController.bulkUpsertAttendance);

router.get('/by-date/:date', attendanceController.getAttendanceByDate);

router.patch('/delete-employee', attendanceController.deleteEmployeeAttendance);
 
router.post('/monthly-summary-custom', attendanceController.getMonthlyAttendanceSummaryCustom);

module.exports = router;
