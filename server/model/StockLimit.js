const mongoose = require("mongoose");

const StockLimitSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    restaurantId: {
      type: String,
      ref: 'RestaurantAdmin',
      required: [true, 'restaurant id is required']
    },
    foodItems: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StockLimit", StockLimitSchema);
