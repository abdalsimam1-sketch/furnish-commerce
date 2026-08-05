const { generateCryptoToken } = require("../../utils/generateCryptoToken");

describe("generateCryptoToken", () => {
  test("returns a crypto token", () => {
    const { cryptoToken } = generateCryptoToken();
    expect(cryptoToken).toBeDefined();
  });

  test("returns a crypto token hash", () => {
    const { cryptoTokenHash } = generateCryptoToken();
    expect(cryptoTokenHash).toBeDefined();
  });

  test("cryto token and crypto token hash are different", () => {
    const { cryptoToken, cryptoTokenHash } = generateCryptoToken();
    expect(cryptoToken).not.toEqual(cryptoTokenHash);
  });
});
