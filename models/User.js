const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    default: "patient"
  },
  approved: {
    type: Boolean,
    default: function () {
      return this.role !== "doctor"; // doctors need approval
    }
  },
   rejected: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
