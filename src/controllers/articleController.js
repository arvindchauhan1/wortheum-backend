const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');
const successHandler = require('../utils/successHandler');
const Article = require('../models/articleModel');
const getCurrentUser = require('../utils/getCurrentUser');



const IMG_PATH = "/public/uploads/"

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
        featuredImage,
        ...optionalFields,
    };

    const article = await Article.create(articleData);

    return successHandler(res, 201, "Article created successfully", { article });
});




// @desc    Get All Articles
exports.getArticles = asyncHandler(async (req, res, next) => {
    const articles = await Article.find({ isDeleted: false });
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

// Optional: Soft delete Article
exports.deleteArticle = asyncHandler(async (req, res, next) => {
    const article = await Article.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
    );

    if (!article) {
        return next(new ApiError(404, 'Article not found'));
    }

    return successHandler(res, 200, 'Article deleted successfully');
});
