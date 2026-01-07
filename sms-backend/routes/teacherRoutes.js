const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const Student = require("../models/User"); // students stored in User collection
const Timetable = require("../models/Timetable");
const User = require("../models/User");
const Class = require("../models/Class");

// All routes require authentication
// router.use(protect);

// ---------------------------
// Teacher-only routes
// ---------------------------





// 👨‍🏫 Get teacher profile
router.get("/usAssignedClass",async(req,res)=>{
  try {
    const unassignClass=await Class.find({isAssigned:false})
    return res.json({message:unassignClass})
  } catch (error) {
    return res.json({message:error.message})
  }
})

router.get("/profile", authorizeRoles("teacher"), async (req, res) => {
  res.status(200).json({ data: req.user });
});

// 🧑‍🎓 Get students assigned to teacher
router.get("/students", async (req, res) => {
  try {
   
    
 
    // const students = await User.find({
    //   role: "student",
    //   $or: classFilters
    // });
   const students = await User.find({ role: "student" });

 console.log("request body",students);
    res.status(200).json({ data: students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Error fetching students" });
  }
});

// 🗓 Get timetable assigned to teacher
router.get("/timetable/:teacherId", authorizeRoles("teacher"), async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    // Find timetable where class matches teacher assigned classes
    const teacherClasses = req.user.assignedClass?.map(c => ({
      className: c.className,
      section: c.section
    })) || [];

    if (!teacherClasses.length) return res.status(200).json({ data: [] });

    const timetable = await Timetable.find({
      $or: teacherClasses
    });

    res.status(200).json({ data: timetable });
  } catch (err) {
    console.error("Error fetching timetable:", err);
    res.status(500).json({ message: "Error fetching timetable" });
  }
});

// ===========================
//   UPDATE TEACHER DETAILS
// ===========================
router.put("/teacher/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const updatedTeacher = await User.findByIdAndUpdate(
      teacherId,
      req.body,
      { new: true }
    );

    res.json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating teacher", error });
  }
});

// ===========================
//        DELETE TEACHER
// ===========================
router.delete("/teacher/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await User.findByIdAndDelete(teacherId);

    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting teacher", error });
  }
});



module.exports = router;

