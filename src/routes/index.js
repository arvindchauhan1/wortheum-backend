const express = require('express');
const router = express.Router();

const authRoute = require('./authRoute');
const articleRoute = require('./articleRoute');
const usersRoute = require('./userRoute')

// Auth routes
router.use('/auth', authRoute);

// Article routes
router.use('/articles', articleRoute);

// Users routes
router.use('/users', usersRoute);

module.exports = router;
