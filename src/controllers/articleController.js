const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');
const successHandler = require('../utils/successHandler');
const Article = require('../models/articleModel');
const getCurrentUser = require('../utils/getCurrentUser');
const { deleteImage } = require('../utils/imageDeleteHelper');

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
    const { title, region, blocks: rawBlocks, featuredImage, category, ...optionalFields } = parsedBody;

    // Validate required fields
    if (!title || !region || !rawBlocks || !category || !req.files?.featuredImage) {
        return next(new ApiError(400, "Title, region, category and featuredImage are required"));
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
        category,
        region,
        blocks, // Optional blocks
        publisherId: req.user._id,
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

// @desc    Delete Article by ID
exports.deleteArticle = asyncHandler(async (req, res, next) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
        return next(new ApiError(404, 'Article not found'));
    }
    // Check if the logged-in user is authorized to delete
    if (
        article.publisherId.toString() !== req.user._id && // Not the publisher
        !['admin', 'super_admin'].includes(req.user.role) // Not an admin
    ) {
        return next(new ApiError(403, 'Unauthorized to delete this article'));
    }


    if (process.env.NODE_ENV === "dev") {
        // Delete featured image
        if (article.featuredImage?.url) {
            deleteImage(article.featuredImage?.url);
        }

        // Delete block images
        if (article.blocks) {
            article.blocks.forEach(block => {
                if (block.type === 'image' && block.data?.url) {
                    deleteImage(block.data.url)
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

// @desc    Update Article
exports.updateArticle = asyncHandler(async (req, res, next) => {
    const articleId = req.params.id;

    let parsedBody;
    try {
        parsedBody = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
    } catch (error) {
        return next(new ApiError(400, "Invalid JSON format in 'data'"));
    }

    const { title, region, blocks: rawBlocks, featuredImage, ...optionalFields } = parsedBody;

    // Find article
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new ApiError(404, "Article not found"));
    }

    // Authorization check
    if (
        article.publisherId.toString() !== req.user._id &&
        !["admin", "super-admin"].includes(req.user.role)
    ) {
        return next(new ApiError(403, "You are not authorized to update this article"));
    }

    /** ======== Featured Image Handling ======== **/
    if (req.files?.featuredImage) {
        // Delete previous image if exists
        if (article.featuredImage?.url) {
            await deleteImage(article.featuredImage.url);
        }
        // Add new
        article.featuredImage = {
            url: IMG_PATH + `${req.files.featuredImage[0].filename}`,
            caption: featuredImage?.caption || '',
            altText: featuredImage?.altText || ''
        };
    } else if (featuredImage) {
        // If only caption or altText updated
        article.featuredImage.caption = featuredImage.caption || article.featuredImage.caption;
        article.featuredImage.altText = featuredImage.altText || article.featuredImage.altText;
    }

    /** ======== Blocks Handling ======== **/
    let blocks = [];
    let imageIndex = 0;

    if (rawBlocks?.length) {
        // Delete old block images
        for (let block of article.blocks) {
            if (block.type === 'image' && block.data.url) {
                await deleteImage(block.data.url);
            }
        }

        // Add new blocks
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
                imageIndex++;
            } else if (block.type !== 'image') {
                blocks.push(block);
            }
        }
        article.blocks = blocks;
    }

    /** ======== Field Updates ======== **/
    if (title) article.title = title;
    if (region) article.region = region;
    Object.assign(article, optionalFields);

    await article.save();

    return successHandler(res, 200, "Article updated successfully", { article });
});

