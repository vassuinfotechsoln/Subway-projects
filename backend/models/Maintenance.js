const mongoose = require("mongoose");

const maintenanceSchema = mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Asset",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    issueDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
module.exports = Maintenance;
