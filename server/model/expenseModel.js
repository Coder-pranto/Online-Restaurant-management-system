const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

module.exports = mongoose.model("Expense", expenseSchema);
