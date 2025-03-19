const mongoose = require('mongoose');

const approveLogSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Admin or Super Admin
    action: {
        type: String,
        enum: ['approved', 'rejected'],
        required: true
    },
    remarks: { type: String },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ApproveLog', approveLogSchema);
