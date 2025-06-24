// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../controllers/UserControllers');

router.post('/register',registerUser);

router.post('/login', loginUser);

module.exports = router;