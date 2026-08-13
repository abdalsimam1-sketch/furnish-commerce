const jwt = require("jsonwebtoken");

const generateCookieTokens = (user) => {
  const payload = { id: user.id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_LIFETIME,
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_LIFETIME,
  });

  return { accessToken, refreshToken };
};

module.exports = {
  generateCookieTokens,
};
