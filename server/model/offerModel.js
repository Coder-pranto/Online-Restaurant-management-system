const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    discount_type: {
      type: String,
      enum: ["percentage", "amount"],
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
    },
    offer_image: {
      type: String,
    },
    food_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
    ],
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    offer_name: {
      type: String,
      required: true,
    },
    isPopular: {
      type: Boolean,
    },
    restaurantId:{
      type: String,
      ref: 'RestaurantAdmin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Offer", offerSchema);
