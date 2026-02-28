const asyncHandler = require("express-async-handler");
const Asset = require("../models/Asset");
const User = require("../models/User");
const { logActivity } = require("../middleware/activityLogger");

// @desc    Get all assets
// @route   GET /api/assets
const getAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({})
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");
  res.json(assets);
});

// @desc    Get asset by ID
// @route   GET /api/assets/:id
const getAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id)
    .populate("assignedTo", "name email")
    .populate("history.user", "name");

  if (asset) {
    res.json(asset);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Create new asset
// @route   POST /api/assets
const createAsset = asyncHandler(async (req, res) => {
  const { assetName, assetType, serialNumber, purchaseDate, warrantyExpiry } =
    req.body;

  const assetExists = await Asset.findOne({ serialNumber });

  if (assetExists) {
    res.status(400);
    throw new Error("Asset with this serial number already exists");
  }

  const asset = new Asset({
    assetName,
    assetType,
    serialNumber,
    purchaseDate,
    warrantyExpiry,
    status: req.body.status || "Available",
    image:
      req.files && req.files.image
        ? `/uploads/${req.files.image[0].filename}`
        : "",
    invoice:
      req.files && req.files.invoice
        ? `/uploads/${req.files.invoice[0].filename}`
        : "",
  });

  const createdAsset = await asset.save();
  await logActivity(
    req,
    "Created Asset",
    "Asset",
    createdAsset._id,
    `Name: ${createdAsset.assetName}`,
  );
  res.status(201).json(createdAsset);
});

// @desc    Update asset
// @route   PUT /api/assets/:id
const updateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);

  if (asset) {
    asset.assetName = req.body.assetName || asset.assetName;
    asset.assetType = req.body.assetType || asset.assetType;
    asset.serialNumber = req.body.serialNumber || asset.serialNumber;
    asset.purchaseDate = req.body.purchaseDate || asset.purchaseDate;
    asset.warrantyExpiry = req.body.warrantyExpiry || asset.warrantyExpiry;
    asset.status = req.body.status || asset.status;
    asset.assignedTo =
      req.body.assignedTo !== undefined
        ? req.body.assignedTo
        : asset.assignedTo;

    if (req.body.assignedTo) {
      asset.assignedBy = req.user._id;
    }

    if (req.files && req.files.image) {
      asset.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files && req.files.invoice) {
      asset.invoice = `/uploads/${req.files.invoice[0].filename}`;
    }

    const updatedAsset = await asset.save();
    await logActivity(
      req,
      "Updated Asset",
      "Asset",
      updatedAsset._id,
      `Name: ${updatedAsset.assetName}`,
    );
    res.json(updatedAsset);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Delete asset
// @route   DELETE /api/assets/:id
const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);

  if (asset) {
    await asset.deleteOne();
    await logActivity(
      req,
      "Deleted Asset",
      "Asset",
      asset._id,
      `Name: ${asset.assetName}`,
    );
    res.json({ message: "Asset removed" });
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Assign asset to user
// @route   PUT /api/assets/:id/assign
const assignAsset = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const asset = await Asset.findById(req.params.id);

  if (asset) {
    asset.assignedTo = userId;
    asset.status = userId ? "Assigned" : "Available";
    asset.assignedBy = userId ? req.user._id : null;

    asset.history.push({
      user: req.user._id,
      action: userId ? `Assigned to ${userId}` : "Unassigned",
    });

    const updatedAsset = await asset.save();
    await logActivity(
      req,
      userId ? "Assigned Asset" : "Unassigned Asset",
      "Asset",
      updatedAsset._id,
      `User ID: ${userId || "N/A"}`,
    );
    res.json(updatedAsset);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Get user assigned assets
// @route   GET /api/assets/my
const getMyAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({ assignedTo: req.user._id }).populate(
    "assignedBy",
    "name email",
  );
  res.json(assets);
});

// @desc    Get asset stats
// @route   GET /api/assets/stats
const getAssetStats = asyncHandler(async (req, res) => {
  const total = await Asset.countDocuments({});
  const assigned = await Asset.countDocuments({ status: "Assigned" });
  const available = await Asset.countDocuments({ status: "Available" });
  const maintenance = await Asset.countDocuments({ status: "Maintenance" });

  const statsByType = await Asset.aggregate([
    { $group: { _id: "$assetType", count: { $sum: 1 } } },
  ]);

  res.json({ total, assigned, available, maintenance, statsByType });
});

// @desc    Get user specific stats
// @route   GET /api/assets/my-stats
const getMyStats = asyncHandler(async (req, res) => {
  const totalAssigned = await Asset.countDocuments({
    assignedTo: req.user._id,
  });
  res.json({ totalAssigned });
});

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  getMyAssets,
  getAssetStats,
  getMyStats,
};
