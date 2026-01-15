const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
} = require("../controllers/roleController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/users",protect,getAllUsers)
 router.get("/users", protect, getAllUsers);
 router.put("/users/:id/role",   updateUserRole);
router.put("/users/:id/status", protect, toggleUserStatus);
module.exports = router;