const User = require("../models/User");

// ✅ Get all teachers (admin only)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    res.status(200).json({ success: true, data: teachers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// ✅ Get own profile (teacher)
exports.getMyProfile = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, data: teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

const Student = require("../models/Student");

// Fetch assigned students
const getStudents = async (req, res) => {
  const students = await Student.find({ className: { $in: req.user.assignedClasses } });
  res.json({ data: students });
};

