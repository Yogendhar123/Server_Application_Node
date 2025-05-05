const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  courseId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: false, // Optional custom date provided by user
  },
  createdAt: {
    type: Date,
    default: Date.now, // System-generated timestamp
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
