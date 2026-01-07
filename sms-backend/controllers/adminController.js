const User = require("../models/User");
const PeriodChangeRequest = require("../models/PeriodChangeRequest");
const bcrypt = require("bcryptjs");

// =============================
// 🔹 Get All Users (Admin Only)
// =============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching users",
      error: err.message,
    });
  }
};

// =============================
// 🔹 Create New User (Admin Only)
// =============================
exports.createUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      className, 
      section 
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if user exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists, please use another one",
      });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    // 👉 Only for students: add class + section
    if (role === "student" && className && section) {
      newUser.assignedClass.push({
        className,
        section,
      });
    }

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "✅ User created successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        assignedClass: newUser.assignedClass,
      },
    });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({
      success: false,
      message: "Server Error while creating user",
      error: err.message,
    });
  }
};


// =============================
// 🔹 Update User (Admin Only)
// =============================
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    // if password update, re-hash
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ User updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({
      success: false,
      message: "Server Error while updating user",
      error: err.message,
    });
  }
};

// =============================
// 🔹 Delete User (Admin Only)
// =============================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "🗑️ User deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({
      success: false,
      message: "Server Error while deleting user",
      error: err.message,
    });
  }
};

// =============================
// 🔹 Period Change Requests
// =============================

// Get all period change requests 
exports.getPeriodChangeRequests = async (req, res) => {
  try {
    const requests = await PeriodChangeRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Approve a request

//  className: { type: String, required: true },
//   section: { type: String, required: true },
//   period: { type: String, required: true },
//   reason: { type: String },
//   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },



