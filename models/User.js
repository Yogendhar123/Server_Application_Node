const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    requestedAdmin: { type: Boolean, default: false },

    // Fields for OTP-based reset
    resetOTP: { type: String }, // 6-digit OTP
    otpExpiry: { type: Date }, // Expiry timestamp
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
