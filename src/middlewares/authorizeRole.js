const ApiError = require('../utils/ApiError');

module.exports = function (requiredRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized'));
        }

        if (!requiredRoles.includes(req.user.role)) {
            return next(new ApiError(403, `Access denied. Allowed roles: ${requiredRoles.join(', ')}`));
        }

        console.log("Authorized")

        next();
    };
};
