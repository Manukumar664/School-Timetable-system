const express = require("express");
const {
  getAllStudents,
  getMyProfile,
  getMyTimetable
} = require("../controllers/studentController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

 // ✅ Admin: Get all students
 router.get("/", protect, authorizeRoles("admin"), getAllStudents);

// ✅ Student: View own profile
 router.get("/profile", protect, authorizeRoles("student"), getMyProfile);

// ✅ Student: View own timetable
router.get("/timetable", protect, authorizeRoles("student"), getMyTimetable);

module.exports = router;
