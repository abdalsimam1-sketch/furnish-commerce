const errorHandler = (error, req, res, next) => {
  if (error.isOperational === true) {
    if (error.status >= 500) {
      console.error(error.stack);
    } else {
      console.error(error.message);
    }
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  console.error(error.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = {
  errorHandler,
};
