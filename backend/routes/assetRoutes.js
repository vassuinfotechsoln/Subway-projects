const express = require("express");
const router = express.Router();
const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  getMyAssets,
  getAssetStats,
  getMyStats,
} = require("../controllers/assetController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "invoice", maxCount: 1 },
]);

router
  .route("/")
  .get(protect, getAssets)
  .post(protect, admin, uploadFields, createAsset);

router.route("/my").get(protect, getMyAssets);
router.route("/my-stats").get(protect, getMyStats);
router.route("/stats").get(protect, admin, getAssetStats);

router
  .route("/:id")
  .get(protect, getAssetById)
  .put(protect, admin, uploadFields, updateAsset)
  .delete(protect, admin, deleteAsset);

router.route("/:id/assign").put(protect, admin, assignAsset);

module.exports = router;
