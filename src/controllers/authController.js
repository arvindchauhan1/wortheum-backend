const User = require('../models/userModel');
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');
const successHandler = require('../utils/successHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const getCurrentUser = require('../utils/getCurrentUser');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (["admin", "super_admin"].includes(role)) {
        return next(new ApiError(403, "Unauthorized to register as an admin account"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError(400, 'Email already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    // Not mandatory, but best practice to always return when responding (whether res.json() or using your successHandler).
    return successHandler(res, 201, 'User registered successfully', {
        name: user.name,
        email: user.email,
        role: user.role
    });
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    // Generate token
    const token = jwt.sign(
        {
            _id: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );


    // Set token in header
    // res.setHeader('Authorization', `Bearer ${token}`);

    // Set token in header BEFORE sending response
    res.setHeader('Authorization', `Bearer ${token}`);

    return successHandler(res, 200, 'Login successful', {
        token,
        role: user.role
    });
});



// @desc    Test Login and return user details
// @route   POST /api/v1/auth/test-login
// @access  Public
exports.testLogin = asyncHandler(async (req, res, next) => {
    const user = await getCurrentUser(req.user._id);
    if (!user) {
        return next(new ApiError(401, 'Invalid login attempt.'));
    }

    return successHandler(res, 200, 'Test login successful', {
        name: user.name,
        email: user.email,
        role: user.role
    });
});
