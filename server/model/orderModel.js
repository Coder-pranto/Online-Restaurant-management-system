const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    tableNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
      },
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    transectionId: String,
    orderPlace:{
      type:String,
      enum:{
        values : ["online","offline"]
      },
      default:"online"
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        addons: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Addons",
            default: [],
            required: true,
          },
        ],
        quantity: { type: Number },
        size: { type: String, default: null },
        sizeName: { type: String, default: null }, // Add sizeName
        pieces: { type: String, default: null },
        pieceName: { type: String, default: null }, // Add pieceName
        spicyLevel: { type: String },
        itemPrice: { type: Number }, // Add itemPrice
      },
    ],
    totalPrice: Number,
    // orderDate: { type: Date, default: Date.now },
    totalNumberOfFood: { type: Number, required: true },
    averagePreparationTime: { type: Number },
    restaurantId: {
      type: String,
      ref: "RestaurantAdmin",
      required: [true, "restaurant id is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Create a static method to generate and set the orderNumber for a new order
orderSchema.statics.generateOrderNumber = async function () {
  const lastOrder = await this.findOne({}, {}, { sort: { orderNumber: -1 } });
  const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber) : 0;
  const newOrderNumber = (lastOrderNumber + 1).toString().padStart(6, "0");
  return newOrderNumber;
};

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = await this.constructor.generateOrderNumber();
  }

  // Calculate totalPrice based on the sum of itemPrice for each item
  // this.totalPrice = this.items.reduce(
  //   (total, item) => total + item.itemPrice,
  //   0
  // );

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
