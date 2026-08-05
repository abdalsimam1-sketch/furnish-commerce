const crypto = require("crypto");

const generateCryptoToken = () => {
  const cryptoToken = crypto.randomBytes(32).toString("hex");
  const cryptoTokenHash = crypto
    .createHash("sha256")
    .update(cryptoToken)
    .digest("hex");

  return { cryptoToken, cryptoTokenHash };
};

module.exports = {
  generateCryptoToken,
};
