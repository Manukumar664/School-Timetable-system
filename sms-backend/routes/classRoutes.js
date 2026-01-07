const express = require("express");
const router = express.Router();
const Class = require("../models/Class");
const User = require("../models/User"); // Teacher/User model
// ================== GET ALL CLASSES ==================
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find().countDocuments()
    res.status(200).json({ classes });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}); 
router.get("/free", async (req, res) => {
  try {
    const allClasses = await Class.find();
    const teachers = await User.find({ role: "teacher" }).select("assignedClass");
    const assigned = new Set();
    teachers.forEach(t => {
      t.assignedClass.forEach(ac => {
        assigned.add(`${ac.className}-${ac.section}`);
      });
    });
    const freeClasses = allClasses.filter(c => {
      const key = `${c.className}-${c.section}`;
      return !assigned.has(key);
    });
    res.status(200).json({
      success: true,
     teachers
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
});
// ================== GET UNASSIGNED CLASSES ==================
router.get("/unassigned", async (req, res) => {
  try {
    const allClasses = await Class.find();
    const teachers = await User.find({ role: "teacher" }).select("assignedClass");
    // assigned class ids 
    let assigned = [];
    teachers.forEach((t) => {
      t.assignedClass.forEach((c) => {
        assigned.push(`${c.className}-${c.section}`);
      });
    });
    // unassigned classes filter  
    const unassigned = allClasses.filter(
      (c) => !assigned.includes(`${c.className}-${c.section}`)
    );
    res.status(200).json({ unassignedClasses: unassigned });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});
// ================== CREATE NEW CLASS ==================
router.post("/", async (req, res) => {
  const { className, section } = req.body;
  if (!className || !section)
    return res.status(400).json({ message: "ClassName and Section are required" });
  try {
    const newClass = new Class({ className, section });
    await newClass.save();
    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});
// ================== UPDATE CLASS ==================
router.put("/:id", async (req, res) => {
  const { className, section } = req.body;
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { className, section },
      { new: true }
    );
    if (!updatedClass)
      return res.status(404).json({ message: "Class not found" });
    res.status(200).json({ message: "Class updated successfully", class: updatedClass });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});  
module.exports = router;
