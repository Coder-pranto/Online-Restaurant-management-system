const Order = require("../model/orderModel");

const createNewOrderService = async (order) => {
  const filter = { _id: order._id };

  // find the existing order
  const existingOrder = await Order.findOne(filter);

  if (existingOrder) {
    const result = await Order.findOneAndUpdate(filter, order, { new: true });
    return result;
  } else {
    const result = await Order.create(order);
    return result;
  }
};

module.exports = {
  createNewOrderService,
};
