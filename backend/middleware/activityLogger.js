const Activity = require("../models/Activity");

const logActivity = async (
  req,
  action,
  entityType,
  entityId = null,
  details = "",
) => {
  try {
    if (!req.user) return; // Only log authenticated activities

    await Activity.create({
      user: req.user._id,
      action,
      entityType,
      entityId,
      details,
      ipAddress:
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.error("Activity Logging Error:", error);
  }
};

module.exports = { logActivity };
