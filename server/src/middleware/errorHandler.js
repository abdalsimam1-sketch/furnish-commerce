const { CustomError } = require("../errors/index");

const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  if (error instanceof CustomError) {
    return res.status(error.status).json({
      success: false,
      status: `${error.status}`.startsWith("4") ? "fail" : "error",
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    status: "error",
    message: "Internal Server Error",
  });
};

module.exports = {
  errorHandler,
};
