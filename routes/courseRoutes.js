const express = require("express");
const router = express.Router();
const Course = require("../models/Courses");

// GET: All Courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ staus: err.message });
  }
});

// GET: Single Course by ID
router.get("/courses/id", async (req, res) => {
  try {
    const course = await Course.findOne({ id: parseInt(req.params.id) });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add New Course
router.post("/courses", async (req, res) => {
  try {
    let newCourseData = req.body;

    // Auto-generate ID if not provided
    if (!newCourseData.id) {
      const lastCourse = await Course.findOne().sort({ id: -1 });
      const nextId = lastCourse ? lastCourse.id + 1 : 1;
      newCourseData.id = nextId;
    }

    const existing = await Course.findOne({ id: newCourseData.id });
    if (existing) {
      return res.status(400).json({ message: "Course ID already exists" });
    }

    const newCourse = new Course(newCourseData);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update Course by ID
router.put("/courses/id", async (req, res) => {
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    if (!updatedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Course by ID
router.delete("/courses/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findOneAndDelete({
      id: parseInt(req.params.id),
    });
    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
