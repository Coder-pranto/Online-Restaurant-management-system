const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + extension);
  },
});

const imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit the file size to 5MB (adjust as needed)
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

module.exports = imageUpload;
