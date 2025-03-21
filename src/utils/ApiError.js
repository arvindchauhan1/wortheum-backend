class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        // Optional: Capture stack trace cleanly
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
