const express = require('express');
const router = express.Router();

const authRoute = require('./authRoute');
const articleRoute = require('./articleRoute');

// Auth routes
router.use('/auth', authRoute);

// Article routes
router.use('/articles', articleRoute);

module.exports = router;
