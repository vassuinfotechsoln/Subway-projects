const mongoose = require("mongoose");

const activitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: ["Asset", "Maintenance", "User", "Auth"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    details: {
      type: String,
      default: "",
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  },
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
