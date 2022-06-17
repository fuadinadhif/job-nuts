const { StatusCodes } = require("http-status-codes");

const errorMidWare = (error, req, res, next) => {
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went crazy. Figure it yourself",
  };

  if (error.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(error.errors)
      .map((error) => error.message)
      .join(" and ");
  }

  if (error.name === "CastError") {
    customError.message = `Job with ID: ${error.value} ain't nowhere to be found`;
  }

  if (error.code && error.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Duplicate value entered for ${Object.keys(
      error.keyValue
    )} field, please use another address`;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorMidWare;
