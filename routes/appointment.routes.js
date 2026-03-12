const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ================= BOOK APPOINTMENT (PATIENT) =================
router.post("/book", auth(["patient"]), async (req, res) => {
  const appointment = await Appointment.create({
    ...req.body,
    patientId: req.user.id
  });
  res.json(appointment);
});

// ================= PATIENT VIEW OWN APPOINTMENTS =================
router.get("/my", auth(["patient"]), async (req, res) => {
  try {
    const apps = await Appointment.find({
      patientId: req.user.id
    }).populate({
      path: "doctorId",
      populate: { path: "userId" }
    });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= DOCTOR VIEW OWN APPOINTMENTS =================
router.get("/doctor", auth(["doctor"]), async (req, res) => {
  try {
    // 🔥 find doctor profile using logged-in user
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    const apps = await Appointment.find({
      doctorId: doctor._id
    })
      .populate("patientId")
      .populate({
        path: "doctorId",
        populate: { path: "userId" }
      })
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= APPROVE / REJECT =================
router.put("/status/:id", auth(["doctor"]), async (req, res) => {
  const app = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(app);
});

module.exports = router;
