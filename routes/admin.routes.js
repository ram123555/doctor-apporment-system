const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const auth = require("../middleware/authMiddleware");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");

const router = express.Router();



// ================= ADMIN ADD DOCTOR (FULL CREATE) =================
router.post("/add-doctor", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password, specialization, experience, availableSlots } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email, password required" });
    }

    // check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user (role = doctor)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor"
    });

    // create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization: specialization || "General Physician",
      experience: experience || 0,
      availableSlots: availableSlots?.length
        ? availableSlots
        : ["09:00-10:00", "10:00-11:00"]
    });

    res.json({
      msg: "Doctor created successfully",
      doctor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});



// ================= UPDATE DOCTOR (ADMIN) =================
router.put("/update-doctor/:id", auth(["admin"]), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("userId");

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});



// Get all users
router.get("/users", auth(["admin"]), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get all appointments

router.get("/appointments", auth(["admin"]), async (req, res) => {
  try {

    const apps = await Appointment.find()

      .populate("patientId", "name email")

      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email"
        }
      });

    res.json(apps);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get pending doctors
router.get("/pending-doctors", auth(["admin"]), async (req, res) => {
  const doctors = await User.find({
    role: "doctor",
    approved: false
  });
  res.json(doctors);
});

//
router.put("/approve-doctor/:id", auth(["admin"]), async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );
  res.json(user);
});
// Reject doctor
router.put("/reject-doctor/:id", auth(["admin"]), async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      rejected: true,
      approved: false
    },
    { new: true }
  );
  res.json(user);
});
// Undo doctor rejection
router.put("/undo-reject-doctor/:id", auth(["admin"]), async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      rejected: false,
      approved: false
    },
    { new: true }
  );
  res.json(user);
});

module.exports = router;
