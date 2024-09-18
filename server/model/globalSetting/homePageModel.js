const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    homePageImage: {
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

module.exports = mongoose.model("HomePage", homePageSchema);
