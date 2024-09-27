const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const validator = require('validator');

const restaurantAdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email address']
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    restaurantId: {
      type: String,
      required: [true, 'Restaurant id is required'],
      trim: true,
      unique: true
    },
    restaurantName: {
      type: String,
      required: [true, 'Restaurant name is required'],
    },
    adminName: {
      type: String,
      maxlength: [20, 'Name should be maximum 20 length']
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'disable'],
        message: 'status will be active or disable',
      },
      default: 'active'
    },
    restaurantCoords: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    restaurantRadius: {
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        default: 'meter'
      },
    },
    address: String,
    mobileNumber: {
      type: String,
      required: true
    },
    themeColor: {
      type: String,
      default: '#00ffff' 
    },
    secondaryColor: {
      type: String,
      default: '#7FFFD4' 
    },
    logo: {
      type: String,
      default: '/default-logo.png' 
    }
  },
  {
    timestamps: true,
  }
);

// restaurantAdminSchema.pre('save', async function (next) {
//   try {
//     if (this.isModified('password')) {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//     }
//     // Validate restaurantRadius value before saving
//     if (this.restaurantRadius && isNaN(this.restaurantRadius?.value)) {
//       throw new Error('Invalid restaurantRadius value. Must be a number.');
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// })

const RestaurantAdmin = new mongoose.model("restaurantAdmin", restaurantAdminSchema);
module.exports = RestaurantAdmin;
