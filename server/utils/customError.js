// Custom error handler class
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'failed' : 'server error';
    }
}

module.exports = CustomError