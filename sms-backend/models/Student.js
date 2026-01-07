const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    rollNo: String,
    className: String,
    section: String,
    phone: String,
    address: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
