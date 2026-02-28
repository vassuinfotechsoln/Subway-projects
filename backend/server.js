const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const userRoutes = require("./routes/userRoutes");
const activityRoutes = require("./routes/activityRoutes");

dotenv.config();
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());

// Prepare uploads directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
