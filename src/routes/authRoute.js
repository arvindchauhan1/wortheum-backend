const express = require('express');
const { register, login, testLogin } = require('../controllers/authController');
const validator = require('../utils/validator');
const { registerValidator, loginValidator } = require('../utils/authValidator');
const auth = require('../middlewares/auth');
const { hiveLogin, hiveRegister } = require('../controllers/hiveAuth');

const router = express.Router();

// Register Route
router.post('/register', registerValidator, validator, register);

// Login Route
router.post('/login', loginValidator, validator, login);


// Hive Login Route
router.post('/hive-login', hiveLogin);

// Hive Register Route
router.post('/hive-register', hiveRegister);

// test login
router.get('/test', auth, testLogin);

module.exports = router;
