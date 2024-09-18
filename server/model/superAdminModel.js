const mongoose = require("mongoose");

const superAdmin = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email address is required'],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'password is required']
    }
  }
);

const SuperAdmin = mongoose.model("superAdminAuth", superAdmin);
module.exports = SuperAdmin;
