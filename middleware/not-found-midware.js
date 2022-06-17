const { StatusCodes } = require("http-status-codes");

const notFoundMidWare = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .send("The route you search for does not exist");
};

module.exports = notFoundMidWare;
