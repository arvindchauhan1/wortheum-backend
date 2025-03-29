const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middlewares/asyncHandler");
const successHandler = require("../utils/successHandler");
const ApiError = require("../utils/ApiError");
const { deleteImage } = require("../utils/imageDeleteHelper");


// Fetch logged-in user profile with full details from DB
exports.getMyProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized"));

    const user = await User.findById(req.user._id);
    if (!user) return next(new ApiError(404, "User not found"));

    successHandler(res, 200, "User profile fetched successfully", user);
});

// Get all users (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
    // const users = await User.find();
    const users = await User.find({ role: { $nin: ["admin", "super_admin"] } });
    successHandler(res, 200, "Users fetched successfully", users);
});

// Get user by ID (Self | Admin)
exports.getUserById = asyncHandler(async (req, res, next) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized"));

    if (!["admin", "super_admin"].includes(req.user.role)) {
        return next(new ApiError(403, "Forbidden: You are not allowed to view this user"));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new ApiError(404, "User not found"));

    successHandler(res, 200, "User fetched successfully", user);
});


// Get all reporters (Admin)
exports.getReporters = asyncHandler(async (req, res, next) => {
    console.log("api run")
    const reporters = await User.find();
    successHandler(res, 200, "Reporters fetched successfully", reporters);
});

// Get all readers (Admin)
exports.getReaders = asyncHandler(async (req, res, next) => {
    const readers = await User.find({ role: "reader" });
    successHandler(res, 200, "Readers fetched successfully", readers);
});

// Create a new user (Admin)
exports.createUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) throw new ApiError(400, "Missing required fields");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    successHandler(res, 201, "User created successfully", user);
});

// Update user (Self)
exports.updateUser = asyncHandler(async (req, res, next) => {
    let userData;

    // Parse JSON data from req.body.data
    try {
        userData = JSON.parse(req.body.data);
    } catch (error) {
        return next(new ApiError(400, "Invalid JSON format in 'data'"));
    }

    // console.log("File : ", req.file)
    // If an image is uploaded, update profile image URL
    if (req.file) {
        const imagePath = `/uploads/${req.file.filename}`;
        userData.profile = userData.profile || {};
        userData.profile.imageUrl = imagePath;
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: userData },
        { new: true }
    );

    if (!updatedUser) throw new ApiError(404, "User not found");

    successHandler(res, 200, "User updated successfully", updatedUser);
});


// Delete user (Admin)
// Delete user (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");

    // Delete profile image if it exists
    if (user.profile?.imageUrl) {
        await deleteImage(user.profile.imageUrl);
    }

    await User.findByIdAndDelete(req.params.id);

    successHandler(res, 200, "User deleted successfully");
});

