const { NotFoundError } = require("../errors");

const notFound = (req, res) => {
  throw new NotFoundError();
};

module.exports = {
  notFound,
};
