const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === "Admin") {
      res.status(400);
      throw new Error("Admin user cannot be deleted");
    }
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  getUsers,
  getUserById,
  deleteUser,
};
