const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");
const Student = require("../models/Student");
const Class = require("../models/Class");
// 🟢 Get all timetable entries       
// router.get("/",protect, async (req, res) => {
//   try {
   
//     console.log("Req user ID:", req.user._id);

//     // Find the student document linked to logged-in user
//     const student = await Student.findOne({ user: req.user._id });
//     console.log("Student doc:", student);

//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     // Check if className and section are set
//     if (!student.className || !student.section) {
//       return res.status(400).json({ success: false, message: "Student class or section not set" });
//     }

   
//     const className = student.className.trim();
//     const section = student.section.trim().toUpperCase();

//     console.log("Class:", className, "Section:", section)
//     const timetable = await Timetable.find({
//       className,
//       section
//     }).sort({ day: 1 });

//     return res.status(200).json({
//       success: true,
//       message: "Timetable fetched successfully",
//       data: timetable
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.post("/createTable", async (req, res) => {
  console.log(req.body); 
  const { day, slot1, slot2, slot3, className, section } = req.body;
  try {
    let classData = await Class.findOne({ className, section });
    if (!classData) {
      classData = new Class({ className, section });
      await classData.save();
    }    
    const newEntry=await Timetable.create({
      day,
      slot1,
      slot2,
      slot3,
      classRef:classData._id
    })
    // const saved = await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/", async (req, res) => {
  //  const classes=await Class.find().populate("className section")
  const { day, slot,classRef}=req.body;
  const newEntry = new Timetable({ day, 
    slot,
    day,
    classRef
   });
  try {
     const saved = await newEntry.save();     
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// 🟢 Delete timetable entry
router.delete("/:id", async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/assignedClass", async (req, res) => {
  try {
    const timetable = await Timetable.find()
      .populate("classRef", "className section")
      .exec();
    const filtered = timetable.filter((t) => t.classRef != null);  
    return res.json({ success: true, data: timetable });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});
// router.get("/assignedClass", protect, async (req, res) => {
//   try {
//     const user = req.user;
//     console.log("assigned user is ", user);

//     if (!user || !user._id) {
//       return res.status(400).json({ message: "User not found or not authenticated" });
//     }

//     // Fetch full user details
//     const teacher = await User.findById(user._id).select("name email role assignedClass");

//     if (!teacher) {
//       return res.status(404).json({ message: "Teacher not found" });
//     }

//     // ✅ Sort assignedClass by recent createdAt / assignedAt
//     teacher.assignedClass.sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));

//     return res.status(200).json({
//       success: true,
//       assignedClass: teacher.assignedClass,
//     });
//   } catch (error) {
//     console.error("Error fetching assigned classes:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });
module.exports = router;