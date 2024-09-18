const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    category_image: {
      type: String,
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

module.exports = mongoose.model("Category", categorySchema);
