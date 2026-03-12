const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    default: "General Physician"
  },
  experience: {
    type: Number,
    default: 0
  },
  availableSlots: {
    type: [String],
    default: ["09:00-10:00", "10:00-11:00"]
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);
