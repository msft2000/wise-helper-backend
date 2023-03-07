const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong, please try again later",
    };
    if (err.name && err.name === "CastError") {
        customError = {
            statusCode: StatusCodes.NOT_FOUND,
            message: `No Job found with the invalid ${err.path}: ${err.value}`,
        };
    }
    if (err.name && err.name === "ValidationError") {
        customError = {
            statusCode: StatusCodes.BAD_REQUEST,
            message: Object.values(err.errors)
                .map((value) => value.message)
                .join(", "),
        };
    }
    if (err.code && err.code === 11000) {
        customError = {
            statusCode: StatusCodes.BAD_REQUEST,
            message: `Duplicate field value entered for ${Object.keys(
                err.keyValue
            )} field, please try again with a different value`,
        };
    }
    return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
