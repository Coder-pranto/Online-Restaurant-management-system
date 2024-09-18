const mongoose = require("mongoose");

const qrCodeInfo = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, 'Table number is required for generating QR code'],
      unique: true,
      trim: true
    },
    qrCodeDataUrl: {
      type: String,
      required: [true, 'QR code data url is required']
    },
    restaurantId:{
      type: String,
      ref: 'RestaurantAdmin',
      required: [true, 'restaurant id is required']
    }
  },
  {
    timestamps: true,
  }
);

const QrCodeInfo = mongoose.model("QrCode", qrCodeInfo);
module.exports = QrCodeInfo;
