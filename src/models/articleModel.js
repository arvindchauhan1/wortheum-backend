const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['paragraph', 'image', 'heading', 'quote'],
        required: true
    },
    data: {
        text: { type: String },
        level: { type: Number },        // for headings (h1 = 1, h2 = 2)
        url: { type: String },          // for images
        caption: { type: String },      // for images/quotes
        altText: { type: String }       // for images
    }
}, { _id: false });

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    category: { type: String },
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Updated here
    region: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    blocks: [blockSchema],
    tags: [String],
    slug: { type: String, unique: true },
    featuredImage: {
        url: String,
        caption: String,
        altText: String
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    readTime: { type: Number },
    approval: {
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reviewedAt: { type: Date },
        notes: { type: String }
    },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

articleSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Article', articleSchema);
