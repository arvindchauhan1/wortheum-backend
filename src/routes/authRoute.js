const express = require('express');
const { register, login } = require('../controllers/authController');
const validator = require('../utils/validator');
const { registerValidator, loginValidator } = require('../utils/authValidator');

const router = express.Router();

// Register Route
router.post('/register', registerValidator, validator, register);

// Login Route
router.post('/login', loginValidator, validator, login);

module.exports = router;
