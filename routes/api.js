const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/protected', authMiddleware, (req, res) => {
    res.json({
        message: 'You are authorized!',
        user: req.user
    });
});

module.exports = router;
