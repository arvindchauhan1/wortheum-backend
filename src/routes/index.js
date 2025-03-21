const express = require('express');
const authRoute = require('./authRoute');

const router = express.Router();

// Define all base routes here
router.use('/auth', authRoute);

module.exports = router;
