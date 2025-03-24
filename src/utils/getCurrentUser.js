const User = require('../models/userModel');
const ApiError = require('./ApiError');

const getCurrentUser = async (id) => {
    console.log(id)
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

module.exports = getCurrentUser;
