const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    food_image: {
      type: String,
    },
    // food_video: {
    //   type: String,
    // },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: String,
    },
    sizes: {
      type: [
        {
          size: { type: String },
          price: { type: Number },
        },
      ],
      default: [],
    },
    pieces: {
      type: [
        {
          pieces: { type: String },
          price: { type: Number },
        },
      ],
      default: [],
    },
    preparationTime: {
      type: Number,
    },
    discount_type: {
      type: String,
    },
    discount_value: {
      type: Number,
    },
    isOffer: {
      type: Boolean,
    },
    isPopular: {
      type: Boolean,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    spicyLevels: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    restaurantId:{
      type: String,
      ref: 'RestaurantAdmin',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", foodSchema);
