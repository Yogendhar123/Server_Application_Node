const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false, // Optional; will be auto-assigned if missing
  },
  name: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  feeStructure: {
    totalFee: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Course", courseSchema);
