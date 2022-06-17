const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const authMidware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "authentication invalid: request headers does not contains valid token. please register/log in first"
      );
    }

    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userID: payload.userID, name: payload.name };
      next();
    } catch (error) {
      throw new UnauthorizedError("authentication invalid: invalid token");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authMidware;
