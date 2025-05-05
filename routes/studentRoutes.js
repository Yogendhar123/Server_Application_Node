const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

// ✅ Ensure this route exists in studentRoutes.js
router.post("/add", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ msg: "Student added successfully", newStudent });
  } catch (error) {
    res.status(500).json({ msg: "Error adding student", error });
  }
});

// ✅ Get all students
router.get("/all", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching students", error });
  }
});

// ✅ Update Student by ID Card Number
router.put("/update/:idCardNo", async (req, res) => {
  try {
    const { idCardNo } = req.params; // Get ID card number from URL
    const { role } = req.body; // Role from frontend (admin/staff)

    let updateData = {};

    if (role === "admin") {
      // ✅ Admin can update all details
      updateData = req.body;
    } else if (role === "staff") {
      // ✅ Staff can only update fees & contact info
      updateData = {
        "contactInfo.phone": req.body.contactInfo?.phone,
        "contactInfo.email": req.body.contactInfo?.email,
        pendingFees: req.body.pendingFees,
        paymentStatus: req.body.paymentStatus,
      };
    } else {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    // ✅ Find and update using ID Card Number
    const updatedStudent = await Student.findOneAndUpdate(
      { idCardNo: idCardNo },
      updateData,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json({ msg: "Student updated successfully", updatedStudent });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

module.exports = router;
