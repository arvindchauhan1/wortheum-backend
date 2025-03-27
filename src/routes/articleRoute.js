const express = require('express');
const router = express.Router();
const {
    createArticle,
    getArticles,
    getArticleById,
    deleteArticle,
    updateArticle
} = require('../controllers/articleController');
const auth = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');
const upload = require('../middlewares/uploadMiddleware');

// Create Article (upload handled inside controller)

router.post('/',
    auth,
    authorizeRole(["reporter", "admin", "super_admin"]),
    upload.fields([
        { name: "featuredImage", maxCount: 1 },
        { name: "blockImages", maxCount: 10 } // Adjust maxCount as needed
    ]),
    createArticle
);

// Get all articles
router.get('/', getArticles);

// Get single article by ID
router.get('/:id', getArticleById);

// Soft delete article by ID
router.delete('/:id',
    auth,
    authorizeRole(["reporter", "admin", "super_admin"]),
    deleteArticle
);

// update article by ID
router.put('/:id',
    auth,
    authorizeRole(["reporter", "admin", "super_admin"]),
    upload.fields([
        { name: "featuredImage", maxCount: 1 },
        { name: "blockImages", maxCount: 10 } // Adjust maxCount as needed
    ]),
    updateArticle
);

module.exports = router;
