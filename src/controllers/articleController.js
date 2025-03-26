const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');
const successHandler = require('../utils/successHandler');
const Article = require('../models/articleModel');
const getCurrentUser = require('../utils/getCurrentUser');



const IMG_PATH = "/uploads/";

// @desc    Create Article
exports.createArticle = asyncHandler(async (req, res, next) => {

    if (process.env.NODE_ENV === "dev") {
        console.log("Received featuredImage:", req.files?.featuredImage[0].filename);  // Debugging
        console.log("Received blockImages:", req.files?.blockImages);  // Debugging
    }

    let parsedBody;
    try {
        parsedBody = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
    } catch (error) {
        return next(new ApiError(400, "Invalid JSON format in 'data'"));
    }
    const { title, region, blocks: rawBlocks, featuredImage, ...optionalFields } = parsedBody;

    // Validate required fields
    if (!title || !region || !rawBlocks || !req.files?.featuredImage) {
        return next(new ApiError(400, "Title, region, and featuredImage are required"));
    }

    // Process featured image
    const finalFeaturedImage = {
        url: IMG_PATH + `${req.files.featuredImage[0].filename}`,
        caption: featuredImage.caption || '',
        altText: featuredImage.altText || ''
    };

    console.log(finalFeaturedImage)

    // Process blocks if provided
    let blocks = [];
    let imageIndex = 0; // Separate index for images

    for (let block of rawBlocks) {
        if (block.type === 'image' && req.files?.blockImages?.[imageIndex]) {
            blocks.push({
                type: 'image',
                data: {
                    url: IMG_PATH + req.files.blockImages[imageIndex].filename,
                    caption: block.data.caption || '',
                    altText: block.data.altText || ''
                }
            });
            imageIndex++; // Increment only when an image block is processed
        } else if (block.type !== 'image') {
            blocks.push(block); // Keep non-image blocks unchanged
        }
    }


    const articleData = {
        title,
        region,
        blocks, // Optional blocks
        publisherId: req.user.id,
        featuredImage: finalFeaturedImage,
        ...optionalFields,
    };

    const article = await Article.create(articleData);

    return successHandler(res, 201, "Article created successfully", { article });
});




// @desc    Get All Articles
exports.getArticles = asyncHandler(async (req, res, next) => {
    const articles = await Article.find({ isDeleted: false });

    if (articles.length === 0) {
        return next(new ApiError(204, 'No articles found'));
    }

    return successHandler(res, 200, 'Articles fetched successfully', articles);
});



// @desc    Get Single Article by ID
exports.getArticleById = asyncHandler(async (req, res, next) => {
    const article = await Article.findOne({ _id: req.params.id, isDeleted: false });

    if (!article) {
        return next(new ApiError(404, 'Article not found'));
    }

    return successHandler(res, 200, 'Article fetched successfully', article);
});


const fs = require('fs');
const path = require('path');
// @desc    Delete Article by ID
exports.deleteArticle = asyncHandler(async (req, res, next) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
        return next(new ApiError(404, 'Article not found'));
    }
    // Check if the logged-in user is authorized to delete
    if (
        article.publisherId.toString() !== req.user.id && // Not the publisher
        !['local_admin', 'super_admin'].includes(req.user.role) // Not an admin
    ) {
        return next(new ApiError(403, 'Unauthorized to delete this article'));
    }


    if (process.env.NODE_ENV === "dev") {
        // Delete featured image
        if (article.featuredImage?.url) {
            const featuredImagePath = path.resolve(`public/${article.featuredImage.url}`);
            console.log(__dirname)
            console.log(featuredImagePath)
            if (fs.existsSync(featuredImagePath)) {
                fs.unlinkSync(featuredImagePath);
            }
        }

        // Delete block images
        if (article.blocks) {
            article.blocks.forEach(block => {
                if (block.type === 'image' && block.data?.url) {
                    const imagePath = path.resolve(`public/${block.data.url}`);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
            });
        }

        // Permanently delete Article
        await Article.findByIdAndDelete(req.params.id);
    } else {
        // soft delete
        article.isDeleted = true;
        await article.save();
    }


    return successHandler(res, 200, 'Article deleted successfully');
});

