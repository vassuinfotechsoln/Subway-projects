const express = require("express");
const router = express.Router();
const {
  getMaintenanceRequests,
  getMyMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, admin, getMaintenanceRequests)
  .post(protect, createMaintenanceRequest);

router.route("/my").get(protect, getMyMaintenanceRequests);

router.route("/:id").put(protect, admin, updateMaintenanceStatus);

module.exports = router;
