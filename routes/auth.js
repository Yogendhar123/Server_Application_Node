const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
let blacklistedTokens = [];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for user authentication and management
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post("/signup", async (req, res) => {
  try {
    const { user: name, mail: email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
  try {
    const { user: name, mail: email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: No token provided or already logged out
 */
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ msg: "No token provided" });
  if (blacklistedTokens.includes(token))
    return res.status(400).json({ msg: "Already logged out" });
  blacklistedTokens.push(token);
  res.json({ msg: "Logout successful" });
});

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP generated
 *       400:
 *         description: User not found
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    res.json({ msg: "OTP generated", otp });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset user password using OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (
      !user.resetOTP ||
      user.resetOTP !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

module.exports = { router, verifyToken, checkRole };
