const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "Admin",
  },
  {
    name: "Demo Employee",
    email: "demo@example.com",
    password: "password123",
    role: "Employee",
  },
];

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      }),
    );

    await User.insertMany(hashedUsers);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
