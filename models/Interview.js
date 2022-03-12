const mongoose = require("mongoose");

const InterviewSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  interviewers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Interviewer",
    },
  ],
  interviewees: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Interviewee",
    },
  ],
});

module.exports = mongoose.model("Interview", InterviewSchema);
