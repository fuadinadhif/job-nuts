const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "please provide your company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "please provide your job position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined", "accepted"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide your name"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
