const crypto = require("crypto");

const generateCryptoToken = () => {
  const cryptoToken = crypto.randomBytes(32).toString("hex");
  const crytoTokenHash = crypto
    .createHash("sha256")
    .update(cryptoToken)
    .digest("hex");

  return { cryptoToken, crytoTokenHash };
};

module.exports = {
  generateCryptoToken,
};
