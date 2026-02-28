const asyncHandler = require("express-async-handler");
const Activity = require("../models/Activity");

// @desc    Get all activities (Admin only)
// @route   GET /api/activities
const getAllActivities = asyncHandler(async (req, res) => {
  const { userId, entityType, limit = 50, page = 1 } = req.query;

  const filter = {};
  if (userId) filter.user = userId;
  if (entityType) filter.entityType = entityType;

  const activities = await Activity.find(filter)
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Activity.countDocuments(filter);

  res.json({
    activities,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  });
});

// @desc    Get my activities (Employee)
// @route   GET /api/activities/my
const getMyActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(activities);
});

module.exports = {
  getAllActivities,
  getMyActivities,
};
