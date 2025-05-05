const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Request Admin Role
router.post("/request-admin", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ msg: "User is already an admin" });
    }

    if (user.requestedAdmin) {
      return res.status(400).json({ msg: "Request already sent" });
    }

    user.requestedAdmin = true;
    await user.save();

    res.json({ msg: "Admin request sent. Waiting for approval." });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Approve Admin Role
router.post("/approve-admin", async (req, res) => {
  try {
    const { adminId, userId } = req.body;
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can approve requests" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.role = "admin";
    user.requestedAdmin = false;
    await user.save();

    res.json({ msg: "User promoted to admin successfully." });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
