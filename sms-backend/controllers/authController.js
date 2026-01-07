const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");
const generateToken = require("../utils/generateToken");


// --------------------- REGISTER CONTROLLER ---------------------
const register = async (req, res) => {
  try {
    const { name, email, password, role, rollNo, className } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role ,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --------------------- LOGIN CONTROLLER ---------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
 const token=generateToken(user)
  res.cookie("token",token,{
    httpOnly:true,
    sameSite:"Strict",
    maxAge:24*60*60*1000
  })
    // ✅ Send success response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token:token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --------------------- EXPORT CONTROLLERS ---------------------
module.exports = { register, login };
