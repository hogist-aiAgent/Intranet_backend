const express = require('express');
const router = express.Router();
const attendanceController = require('./../controllers/AttendanceControllers');
//test
router.post('/bulk-upsert', attendanceController.bulkUpsertAttendance);

router.get('/by-date/:date', attendanceController.getAttendanceByDate);

module.exports = router;
