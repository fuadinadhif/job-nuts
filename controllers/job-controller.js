const JobModel = require("../models/job-model");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res, next) => {
  try {
    const userName = req.user.name;

    const jobs = await JobModel.find({ createdBy: req.user.userID }).sort(
      "createdAt"
    );
    if (jobs.length == 0) {
      return res.status(StatusCodes.OK).json({
        message: `user ${userName} did not have any jobs listed here`,
      });
    }

    res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

const getJob = async (req, res, next) => {
  try {
    const {
      user: { userID, name: userName },
      params: { id: jobID },
    } = req;

    const job = await JobModel.findOne({ _id: jobID, createdBy: userID });
    if (!job) {
      throw new NotFoundError(
        `no job with ID: ${jobID} found for user ${userName}`
      );
    }

    res.status(StatusCodes.OK).json({ name: userName, job });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.userID;
    const job = await JobModel.create(req.body);

    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const {
      body: { company, position, status },
      user: { userID, name: userName },
      params: { id: jobID },
    } = req;
    if (!company || !position || !status) {
      throw new BadRequestError("please fill in the updated form");
    }

    const job = await JobModel.findByIdAndUpdate(
      {
        _id: jobID,
        createdBy: userID,
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      throw new NotFoundError(
        `could not find the associate job for user ${userName}`
      );
    }

    res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const {
      params: { id: jobID },
      user: { userID, name: userName },
    } = req;

    const job = await JobModel.findByIdAndRemove({
      _id: jobID,
      createdBy: userID,
    });
    if (!job) {
      throw new NotFoundError(
        `could not find or delete the associate job for user ${userName}`
      );
    }

    res.status(StatusCodes.OK).json({ message: "job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
