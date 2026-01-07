const PeriodChangeRequest = require("../models/PeriodChangeRequest");
const User = require("../models/User");

// ===================== CREATE PERIOD CHANGE REQUEST =====================
exports.createPeriodChangeRequest = async (req, res) => {
  const teacherId = req.user._id; // Logged in teacher
  const { className, section, period, reason } = req.body;

  if (!teacherId) {
    return res.status(400).json({ message: "Teacher ID not found" });
  }

  try {
    const request = await PeriodChangeRequest.create({
      teacherId,
      className,
      section,
      period,
      reason,
      status: "pending",
    });

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== GET REQUESTS =====================
exports.getRequests = async (req, res) => {
  try {
    let requests;

    // Teacher sees only own requests
    if (req.user.role === "teacher") {
      requests = await PeriodChangeRequest.find({ teacherId: req.user._id })
        .populate("teacherId", "name email role");
    } 
    // Admin sees all requests
    else if (req.user.role === "admin") {
      requests = await PeriodChangeRequest.find()
        .populate("teacherId", "name email role");
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== UPDATE REQUEST (ADMIN APPROVE/REJECT) =====================
exports.updateRequest = async (req, res) => {
  try {
    const request = await PeriodChangeRequest.findByIdAndUpdate(
      req.params.id,
      req.body, // { status: "approved" } or { status: "rejected" }
      { new: true }
    ).populate("teacherId", "name email role");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
