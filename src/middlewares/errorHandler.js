const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.statusCode = err.statusCode;

  console.log(err.stack);

  if (err.code === 11000) {
    error = new ErrorResponse(
      `${Object.keys(err.keyValue)} ${Object.values(
        err.keyValue
      )} is already exist`,
      400
    );
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  return res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
