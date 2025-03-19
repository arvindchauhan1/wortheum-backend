const mongoose = require('mongoose');


// optional for like for comment as well as article
// const likeSchema = new mongoose.Schema({
//     type: { type: String, enum: ['article', 'comment'], required: true },
//     targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     createdAt: { type: Date, default: Date.now }
// });


const likeSchema = new mongoose.Schema({
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Like', likeSchema);
