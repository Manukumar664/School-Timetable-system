const User = require("../models/User");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER ROLE
const updateUserRole = async (req, res) => {
 const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

   // user.roleHistory.push({ role, changedBy: req.user._id });
   console.log("user",user);
   
    user.role = role;
    await user.save();

    res.json({ message: "Role updated", user });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: "Server error" });
  }
};

// TOGGLE STATUS
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "User status updated", isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
};
