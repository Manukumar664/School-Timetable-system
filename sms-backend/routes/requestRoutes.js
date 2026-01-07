const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  createPeriodChangeRequest,
  getRequests,
  updateRequest,
} = require("../controllers/requestController");
// ===================== TEACHER ROUTES =====================
// Teacher creates a new period change request
router.post(
  "/period-change",
  protect,
  authorizeRoles("teacher"),
  createPeriodChangeRequest
);
// Teacher views own period change requests
router.get(
  "/period-change/teacher",
  protect,
  authorizeRoles("teacher"),
  getRequests
);
// ===================== ADMIN ROUTES =====================
// Admin views all period change requests
router.get(
  "/period-change/admin",
  protect,
  authorizeRoles("admin"),
  getRequests
);
// Admin updates a request (approve/reject)
router.patch(
  "/period-change/admin/:id",
  protect,
  authorizeRoles("admin"),
  updateRequest
);
module.exports = router;
