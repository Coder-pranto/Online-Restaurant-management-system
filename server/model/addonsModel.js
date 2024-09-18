const mongoose = require("mongoose");

const addonsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    addonsImage: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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

module.exports = mongoose.model("Addons", addonsSchema);
