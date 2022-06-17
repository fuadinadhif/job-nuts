const UserModel = require("../models/user-model");
const JobModel = require("../models/job-model");
const userData = require("../mock-data/users.json");
const jobData = require("../mock-data/jobs.json");
const { StatusCodes } = require("http-status-codes");

const factoryReset = async (req, res, next) => {
  try {
    await UserModel.deleteMany({});
    await JobModel.deleteMany({});

    for (user of userData) {
      await UserModel.create(user);
    }

    for (job of jobData) {
      const createdBy = await UserModel.findOne({ name: job.createdBy });
      await JobModel.create({ ...job, createdBy });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "database has been reset back to the factory setting" });
  } catch (error) {
    next(error);
  }
};

module.exports = factoryReset;
