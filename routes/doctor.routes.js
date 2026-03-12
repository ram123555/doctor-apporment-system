const express = require("express");
const Doctor = require("../models/Doctor");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/*
========================================
GET ALL DOCTORS (Public / Patient)
✔ Only approved doctors
✔ Hide rejected doctors
✔ Backward compatible with old records
========================================
*/
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate({
        path: "userId",
        select: "name email approved rejected",
        match: {
          // ❌ exclude rejected doctors
          rejected: { $ne: true },

          // ✅ include:
          // 1. approved doctors
          // 2. old doctors where approved field does not exist
          $or: [
            { approved: true },
            { approved: { $exists: false } }
          ]
        }
      });

    // 🔥 remove null userId (filtered out by populate match)
    const visibleDoctors = doctors.filter(d => d.userId !== null);

    res.json(visibleDoctors);
  } catch (err) {
    console.error("Doctor fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/*
========================================
GET OWN DOCTOR PROFILE (Doctor)
========================================
*/
router.get("/profile", auth(["doctor"]), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.user.id
    }).populate("userId", "name email");

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/*
========================================
UPDATE OWN PROFILE (Doctor)
========================================
*/
router.put("/profile", auth(["doctor"]), async (req, res) => {
  try {
    const { specialization, experience, availableSlots } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id }, // 🔐 secure
      {
        specialization,
        experience,
        availableSlots
      },
      { new: true }
    ).populate("userId", "name email");

    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
