const { ForbiddenError } = require("../errors/index");

const authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError();
    } else {
      next();
    }
  };
};
