const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Timetable = require("../models/Timetable");
const Holiday = require("../models/Holiday");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const Student = require("../models/Student");
const Class = require("../models/Class");

// =========================
// 🟢 Register new user (public)
// =========================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Please provide name, email, and password" });

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ success: false, message: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: role || "student" });
    await newUser.save();

    res.status(201).json({ success: true, message: "✅ User registered successfully", data: newUser });
  } catch (err) {
    console.error("POST /register error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});

// =========================
// 🔵 Login Route (all roles)
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "✅ Login successful",
      token,
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("POST /login error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});
// =========================
// 🟠 Get all users (admin & teacher)
// =========================
router.get("/users", protect, authorizeRoles("admin","teacher"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});// =========================
// 🟢 Create new user (admin)
// =========================
router.post("/users", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, section, className, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name & Email required",
      });
    }
    // role missing → default student  
    const newRole = role || "student";
    const user = await User.create({
      name,
      email,
      section,
      className,
      role: newRole,
      password: "123456", // default password
    });
    res.json({
      success: true,
      data: user,
      message: `${newRole} created successfully`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// =========================
// 🔴 Delete user (admin and teacher)
// =========================
router.delete("/user/:id", protect, authorizeRoles("admin","teacher"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});
// =========================
// 🟤 Update user (admin and teacher)
// =========================
router.put("/user/:id", protect, authorizeRoles("admin","teacher"), async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});
// =========================
// 🟡 Timetable CRUD (admin only)
// =========================
router.get("/timetable", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const timetable = await Timetable.find();
    res.json({ success: true, data: timetable });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});
router.post("/timetable", protect, authorizeRoles("admin"), async (req, res) => {
  try {
  
    const { day, className, section, slot1, slot2, slot3,time } = req.body;

    // Validate required fields
    if (!day || !className || !section)
      return res.status(400).json({ success: false, message: "Day, Class and Section are required" });

    // Validate slot structure
    if (
      !slot1?.time || !slot1?.subject ||
      !slot2?.time || !slot2?.subject ||
      !slot3?.time || !slot3?.subject
    ) {
      return res.status(400).json({
        success: false,
        message: "Each slot must include time and subject"
      });
    }

    // Create new timetable entry
    const newRow = await Timetable.create({
      day,
      className,
      section,
      slot1,
      slot2,
      slot3,
      time
    });
    res.status(201).json({ success: true, data: newRow });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});
router.put("/timetable/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { slot1, slot2, slot3 ,className,section,day} = req.body;
    const updated = await Timetable.findByIdAndUpdate(req.params.id, { slot1, slot2, slot3,section,day,className }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Timetable entry not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});
router.delete("/timetable/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const deleted = await Timetable.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Timetable entry not found" });
    res.json({ success: true, message: "Timetable entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});
// =========================
// 🟠 Assign Class to Teacher
// =========================
router.post("/assign-class", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    console.log(req.body);
    
    const { teacherId, className, section, time, subject } = req.body;

    // Validate input
    if (!teacherId || !className || !section || !time || !subject) {
      return res.status(400).json({
        success: false,
        message: "teacherId, className, section, time, subject are required"
      });
    }

    // Teacher Find
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    // 🔥 Class Model Se Find Karo
    const classData = await Class.findOne({ className, section });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found in Class Model"
      });
    }

    // 👉 Agar class already kisi teacher ko assign hai
    if (classData.isAssigned) {
      return res.status(400).json({
        success: false,
        message: "This class is already assigned to another teacher"
      });
    }

    // Push assigned class to teacher
    const assignedClass = { className, section, time, subject };
    teacher.assignedClass.push(assignedClass);
    await teacher.save();

    // Set class as assigned
    classData.isAssigned = true;
    await classData.save();

    res.json({
      success: true,
      message: "Class assigned successfully",
      data: {
        teacher,
        class: classData
      }
    });

  } catch (err) {
    console.error("POST /assign-class error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
});

router.post("/assign-class",async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
})
// router.get("/assignClassTeacher",async(req,res)=>{
//   try {
//     const totalClass=await Class.find()
//     const teacher=await User.find({role:"teacher"})

//   } catch (error) {
    
//   }
// })

//class find kro

router.get("/classes/unassigned", async (req, res) => {
  try {
   
    const teacher = await User.find({role:"teacher"}).select("assignedClass");
   

    res.status(200).json({ teacher });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


//sbse pahle find kro teacher ka assign kiya hua class jp milega user modele se 

// =========================
// 🟢 Holidays CRUD
// =========================
router.get("/holidays", protect, authorizeRoles("admin","teacher","student"), async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ startDate: 1 });
    res.json({ success: true, data: holidays });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/holidays", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { title, startDate, endDate, appliesTo, createdBy } = req.body;
    if (!title || !startDate) return res.status(400).json({ success: false, message: "Title और Start Date जरूरी हैं" });

    const newHoliday = await Holiday.create({ title, startDate, endDate: endDate || startDate, appliesTo: appliesTo || "all", createdBy });
    res.status(201).json({ success: true, data: newHoliday });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

router.put("/holidays/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const updatedHoliday = await Holiday.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Holiday updated", data: updatedHoliday });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/holidays/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Holiday deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 🟢 Fetch teachers
// =========================
router.get("/teachers", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    res.status(200).json({ success: true, message: "Teachers fetched successfully", data: teachers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error while fetching teachers", error: err.message });
  }
});



module.exports = router;
