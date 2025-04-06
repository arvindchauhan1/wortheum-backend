const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    country: String,
    state: String,
    city: String,
    zip: String,
}, { _id: false });

const profileSchema = new mongoose.Schema({
    imageUrl: String,
    bio: String,
    contactNumber: String,
    region: regionSchema,
}, { _id: false });

const reporterDetailsSchema = new mongoose.Schema({
    verified: { type: Boolean, default: false },
    credentials: String,
    assignedCategories: [String],
    portfolio: [String],
    rating: { type: Number, min: 0, max: 5 },
}, { _id: false });

const adminDetailsSchema = new mongoose.Schema({
    permissions: [String],
    managedRegions: [String],
    notes: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // Make sparse to allow Hive-only users
    password: { type: String, required: true },
    hiveUsername: { type: String, unique: true, sparse: true },
    hivePublicKey: { type: String },
    role: {
        type: String,
        enum: ['reader', 'reporter', 'admin', 'super_admin'],
        default: 'reader'
    },
    profile: profileSchema,
    reporterDetails: reporterDetailsSchema,
    adminDetails: adminDetailsSchema,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
