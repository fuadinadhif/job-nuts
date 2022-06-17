const UserModel = require("../models/user-model");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../errors");

const register = async (req, res, next) => {
  try {
    await UserModel.create(req.body);

    const { email } = req.body;
    const user = await UserModel.findOne({ email }).select("-password -__v");

    res.status(StatusCodes.CREATED).json({
      message: "account created. please proceed to the login page",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("please provide a valid email and password");
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundError("email was not registered");
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new UnauthorizedError("wrong password. try again");
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
      message: "login success. use the token below to access job pages",
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
