const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new UnauthenticatedError();
    }

    const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authentication,
};
