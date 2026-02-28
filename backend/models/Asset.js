const mongoose = require("mongoose");

const assetSchema = mongoose.Schema(
  {
    assetName: {
      type: String,
      required: true,
    },
    assetType: {
      type: String,
      required: true,
      enum: ["Hardware", "Software"],
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    warrantyExpiry: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Available", "Assigned", "Maintenance"],
      default: "Available",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
    invoice: {
      type: String,
      default: "",
    },
    history: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        action: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Asset = mongoose.model("Asset", assetSchema);
module.exports = Asset;
