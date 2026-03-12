const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/*
=====================================
REGISTER
=====================================
*/
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      approved: role !== "doctor", // 🔒 doctors need admin approval
      rejected: false              // ✅ IMPORTANT DEFAULT
    });

    // create doctor profile if role = doctor
    if (role === "doctor") {
      const alreadyExists = await Doctor.findOne({ userId: user._id });

      if (!alreadyExists) {
        await Doctor.create({
          userId: user._id,
          specialization: "General Physician",
          experience: 0,
          availableSlots: ["09:00-10:00", "10:00-11:00"]
        });
      }
    }

    res.json({
      msg:
        role === "doctor"
          ? "Registered successfully. Awaiting admin approval."
          : "Registered successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/*
=====================================
LOGIN
=====================================
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // ❌ BLOCK REJECTED DOCTOR
    if (user.role === "doctor" && user.rejected) {
      return res.status(403).json({
        msg: "Doctor account rejected by admin"
      });
    }

    // ⏳ BLOCK UNAPPROVED DOCTOR
    if (user.role === "doctor" && !user.approved) {
      return res.status(403).json({
        msg: "Doctor account pending admin approval"
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        
      },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/*
=====================================
GET LOGGED-IN USER (FOR DASHBOARDS)
=====================================
*/
router.get("/me", auth(["admin", "doctor", "patient"]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role approved rejected"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
