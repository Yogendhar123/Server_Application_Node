const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    classYear: { type: String, required: true }, // Example: "10th Grade"
    idCardNo: { type: String, unique: true, required: true },
    totalFees: { type: Number, required: true },
    pendingFees: { type: Number, default: 0 }, // Default is 0 if fully paid
    paymentStatus: {
      type: String,
      enum: ["fully_paid", "pending"],
      default: "pending",
    },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String, required: true, unique: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
