const crypto = require("crypto");
const hashCryptoToken = (cryptoToken) => {
  return crypto.createHash("sha256").update(cryptoToken).digest("hex");
};

module.exports = {
  hashCryptoToken,
};
