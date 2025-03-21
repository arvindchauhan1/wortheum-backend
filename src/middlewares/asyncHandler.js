const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error(`❌ Error in ${req.method} ${req.originalUrl} -> ${err.message}`);
        next(err);
    });
};

module.exports = asyncHandler;
