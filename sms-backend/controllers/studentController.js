 const Class = require("../models/Class");
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

// const getMyTimetable = async (req, res) => {
//   try {
//     // console.log("s",req.user);
//     const student=req.user._id
    

// const user=await User.findById(student)


//     const query = {
//       className: user.className ? user.className .trim() : "",
//       section: user.section ? user.section.trim().toUpperCase() : ""
//     };
    
//  console.log(query);
 
   
//     const timetable = await Timetable.find(query).populate("classRef")
// console.log(timetable);


//     res.status(200).json({
//       success: true,
//       message: "Timetable fetched successfully",
//       data: timetable
//     });
//   } catch (error) {
//     console.error("Error fetching timetable:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const getMyTimetable = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Logged-in user
    const user = await User.findById(userId);

    if (!user.className || !user.section) {
      return res.status(400).json({
        success: false,
        message: "User class or section not assigned",
      });
    }

    // 2️⃣ Find class using className & section
    const classData = await Class.findOne({
      className: user.className.trim(),
      section: user.section.trim().toUpperCase(),
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // 3️⃣ Find timetable using classRef
    const timetable = await Timetable.find({
      classRef: classData._id,
    }).populate("classRef");

    res.status(200).json({
      success: true,
      message: "Timetable fetched successfully",
      data: timetable,
    });

  } catch (error) {
    console.error("Error fetching timetable:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { getAllStudents, getMyProfile, getMyTimetable };
