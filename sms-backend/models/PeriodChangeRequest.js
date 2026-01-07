const mongoose = require("mongoose");

const periodChangeRequestSchema = new mongoose.Schema({
 teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  period: { type: String, required: true },
  reason: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PeriodChangeRequest", periodChangeRequestSchema);
