const express = require('express');
const router = express.Router();
const staffController = require('./../controllers/StaffControllers');

router.post('/', staffController.createStaff);
router.post('/getByEmail', staffController.getStaffByEmail);
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
