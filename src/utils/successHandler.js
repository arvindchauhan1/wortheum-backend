const successHandler = (res, statusCode = 200, message = 'Success', data = {}) => {
    const response = {
        success: true,
        message,
    };

    if (Object.keys(data).length > 0) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

module.exports = successHandler;
