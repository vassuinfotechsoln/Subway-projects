const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

// File filtering
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images or PDFs only!");
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = upload;
