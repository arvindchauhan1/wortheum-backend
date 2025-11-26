const dsteem = require('dsteem');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const successHandler = require('../utils/successHandler');
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/userModel');

const client = new dsteem.Client('https://api.hive.blog');

// @desc    Login Hive User
// @route   POST /api/v1/auth/hive-login
// @access  Public
exports.hiveLogin = asyncHandler(async (req, res, next) => {
    const { hiveUsername, postingKey } = req.body;

    if (!hiveUsername || !postingKey) {
        return next(new ApiError(400, 'Hive username and posting key are required'));
    }

    const key = dsteem.PrivateKey.fromString(postingKey);

    try {
        // Fetch Hive account
        const [account] = await client.database.getAccounts([hiveUsername]);
        if (!account) {
            return next(new ApiError(401, 'Invalid Hive username'));
        }

        // Validate posting key
        const pubPostingKey = account.posting.key_auths[0][0];
        const isValid = key.createPublic().toString() === pubPostingKey;
        if (!isValid) {
            return next(new ApiError(401, 'Invalid posting key'));
        }

        // Check if user exists in DB
        const user = await User.findOne({ hiveUsername });
        if (!user) {
            return next(new ApiError(404, 'User not registered. Please register first.'));
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                _id: user._id.toString(),
                // hiveUsername,
                loginMethod: 'hive',
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.setHeader('Authorization', `Bearer ${token}`);

        return successHandler(res, 200, 'Hive login successful', {
            hiveUsername,
            token,
            role: user.role
        });

    } catch (error) {
        return next(new ApiError(500, 'Hive login failed'));
    }
});


// @desc    Login Hive User
// @route   POST /api/v1/auth/hive-register
// @access  Public
exports.hiveRegister = asyncHandler(async (req, res, next) => {
    const {
        hiveUsername,
        postingKey,
        name,
        role, // optional: defaults to 'reader'
        profile,
        reporterDetails = {},
    } = req.body;

    if (!hiveUsername || !postingKey || !name) {
        return next(new ApiError(400, 'hiveUsername, postingKey, and name are required'));
    }

    let key;
    try {
        key = dsteem.PrivateKey.fromString(postingKey);
    } catch {
        return next(new ApiError(401, 'Invalid posting key format'));
    }

    const accounts = await client.database.getAccounts([hiveUsername]);
    const account = accounts[0];
    if (!account) return next(new ApiError(404, 'Hive account not found'));

    const pubPostingKey = account.posting.key_auths[0][0];
    const isValid = key.createPublic().toString() === pubPostingKey;

    if (!isValid) {
        return next(new ApiError(401, 'Posting key does not match the Hive account'));
    }

    const existing = await User.findOne({ hiveUsername });
    if (existing) return next(new ApiError(409, 'Hive user already registered'));

    const user = await User.create({
        name,
        hiveUsername,
        hivePublicKey: pubPostingKey,
        password: 'hive-auth', // placeholder to satisfy required field
        role: role || 'reader',
        profile,
        reporterDetails,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return successHandler(res, 201, 'Hive user registered successfully', {
        token,
        user
    });
});
