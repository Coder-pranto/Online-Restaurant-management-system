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



// const imageUpload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5, // Limit the file size to 5MB for images
//   },
//   fileFilter: function (req, file, cb) {
//     const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
//     const videoTypes = ["video/mp4", "video/mkv"];
//     if (imageTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else if (videoTypes.includes(file.mimetype)) {
//       // Check for video duration here if needed, otherwise allow
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type"), false);
//     }
//   },
// });