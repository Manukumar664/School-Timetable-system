 const Student = require("../models/Student");
 const Timetable = require("../models/Timetable"); // assume aapka timetable model yehi hai
const User = require("../models/User");

// 🧑‍💼 Admin: Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("user", "name email role");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🎓 Student: Get own profile
const getMyProfile = async (req, res) => {
  try {
    
const user=req.user


return res.status(200).json({
user,
  
})
  } catch (error) {
    console.error("Error fetching student profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyTimetable = async (req, res) => {
  try {
    const student=req.user._id
    const query = {
      className: student.class ? student.class.trim() : "",
      section: student.section ? student.section.trim().toUpperCase() : ""
    };

    const timetable = await Timetable.find(query).sort({ day: 1 });

    res.status(200).json({
      success: true,
      message: "Timetable fetched successfully",
      data: timetable
    });
  } catch (error) {
    console.error("Error fetching timetable:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { getAllStudents, getMyProfile, getMyTimetable };
