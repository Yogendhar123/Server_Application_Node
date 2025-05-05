const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");

// 📥 CREATE a new rating
router.post("/ratings", async (req, res) => {
  try {
    const newRating = new Rating(req.body);
    await newRating.save();
    res.status(201).json(newRating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📤 READ all ratings
router.get("/ratings", async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📤 READ ratings by courseId
router.get("/ratings/course/:courseId", async (req, res) => {
  try {
    const ratings = await Rating.find({
      courseId: parseInt(req.params.courseId),
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔄 UPDATE a rating by ID
router.put("/ratings/:id", async (req, res) => {
  try {
    const updated = await Rating.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Rating not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ DELETE a rating by ID
router.delete("/ratings/:id", async (req, res) => {
  try {
    const deleted = await Rating.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Rating not found" });
    res.json({ message: "Rating deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
