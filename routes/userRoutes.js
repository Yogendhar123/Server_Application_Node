const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Update User Details (Admin Only)
router.put("/update/:id", async (req, res) => {
  try {
    const { adminId, updatedData } = req.body; // Admin ID should be passed

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can update users" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

module.exports = router;
