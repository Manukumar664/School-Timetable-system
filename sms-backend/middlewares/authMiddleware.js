const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================
// Protect routes (Token required)
// =========================
const protect = async (req, res, next) => {
  let token=req.cookies?.token
  console.log("token",token)
  if (!token) {
    
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
     
      return res.status(401).json({ message: "Token failed - user not found" });
    }

   
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message); // 🔍 log verification error
    res.status(401).json({ message: "Token failed" });
  }
};

// =========================
// Authorize specific roles
// =========================
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("User role:", req.user.role, "| Allowed roles:", roles); // 🔍 log roles
    if (!roles.includes(req.user.role)) {
      console.log("Access denied for user:", req.user.email); // 🔍 log denied access
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
       

 