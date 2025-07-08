const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

router.post('/upload', payrollController.createPayroll);
router.get('/', payrollController.getAllPayrolls);
router.get('/:employeeId', payrollController.getPayrollsByEmployeeId);
router.put('/:id', payrollController.updatePayroll);
router.delete('/:id', payrollController.deletePayroll);

module.exports = router;
