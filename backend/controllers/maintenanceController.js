const asyncHandler = require("express-async-handler");
const Maintenance = require("../models/Maintenance");
const Asset = require("../models/Asset");
const { logActivity } = require("../middleware/activityLogger");

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
const getMaintenanceRequests = asyncHandler(async (req, res) => {
  const requests = await Maintenance.find({})
    .populate("assetId", "assetName assetType serialNumber")
    .populate("userId", "name email");
  res.json(requests);
});

// @desc    Get my maintenance requests
// @route   GET /api/maintenance/my
const getMyMaintenanceRequests = asyncHandler(async (req, res) => {
  const requests = await Maintenance.find({ userId: req.user._id })
    .populate("assetId", "assetName assetType serialNumber")
    .populate("userId", "name email");
  res.json(requests);
});

// @desc    Create new maintenance request
// @route   POST /api/maintenance
const createMaintenanceRequest = asyncHandler(async (req, res) => {
  const { assetId, issueDescription } = req.body;

  const asset = await Asset.findById(assetId);

  if (asset) {
    const request = new Maintenance({
      assetId,
      userId: req.user._id,
      issueDescription,
    });

    const createdRequest = await request.save();

    // Automatically update asset status to Maintenance
    asset.status = "Maintenance";
    await asset.save();

    await logActivity(
      req,
      "Created Maintenance Request",
      "Maintenance",
      createdRequest._id,
      `Issue: ${issueDescription}`,
    );
    res.status(201).json(createdRequest);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Update maintenance status
// @route   PUT /api/maintenance/:id
const updateMaintenanceStatus = asyncHandler(async (req, res) => {
  const request = await Maintenance.findById(req.params.id);

  if (request) {
    request.status = req.body.status || request.status;

    const updatedRequest = await request.save();

    // If status resolved, change asset status back
    if (req.body.status === "Resolved") {
      const asset = await Asset.findById(request.assetId);
      if (asset) {
        asset.status = asset.assignedTo ? "Assigned" : "Available";
        await asset.save();
      }
    }

    await logActivity(
      req,
      `Maintenance Status: ${req.body.status}`,
      "Maintenance",
      updatedRequest._id,
    );
    res.json(updatedRequest);
  } else {
    res.status(404);
    throw new Error("Maintenance request not found");
  }
});

module.exports = {
  getMaintenanceRequests,
  getMyMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceStatus,
};
