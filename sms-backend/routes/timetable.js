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
  const { day, slot1, slot2, slot3, className, section } = req.body;
  try {
    let classData = await Class.findOne({ className, section });
    if(classData){
      return res.status(400).json({message:"class and section already assigned"})
    }
  
      classData = new Class({ className, section });
      await classData.save();
   
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
    
    const {id}=req.params
    const table=await Timetable.findById(id)
    const classID=table.classRef

  await Timetable.findByIdAndDelete(id)
   if(classID){
      await Class.findByIdAndDelete(classID)
   }
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

module.exports = router;