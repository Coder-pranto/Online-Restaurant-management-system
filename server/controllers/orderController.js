const Order = require("../model/orderModel");
const Food = require("../model/foodModel");
const Stock = require("../model/StockLimit");
const Addons = require("../model/addonsModel");
const fs = require("fs");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");


const orderController = {
  //------------------------------------------------Create A new Order--------------------------------------------------
  createOrder: async (req, res) => {
    try {
      const { table_no, status, payment_method, payment_status, items } =
        req.body;
      const foodIds = items.map((item) => item.foodId);

      const orderDate = new Date();

      const newOrderItems = await Promise.all(
        items.map(async (item) => {
          const foodId = item.foodId;
          const quantityOrdered = item.quantity;
          const food = await Food.findById(foodId);

          if (!food) {
            return res.status(404).json({
              message: `Food with ID ${foodId} not found.`,
            });
          }

          // Check if the user selected a size or piece
          if (item.size) {
            const selectedSize = food.sizes.find(
              (size) => size._id.toString() === item.size
            );

            if (selectedSize) {
              item.sizeName = selectedSize.size;
              item.itemPrice = selectedSize.price * quantityOrdered;
            } else {
              return res.status(400).json({
                message: `Selected size not found for Food "${food.name}".`,
              });
            }
          } else if (item.pieces) {
            const selectedPieces = food.pieces.find(
              (piece) => piece._id.toString() === item.pieces
            );

            if (selectedPieces) {
              item.pieceName = selectedPieces.pieces;
              item.itemPrice = selectedPieces.price * quantityOrdered;
            } else {
              return res.status(400).json({
                message: `Selected pieces not found for Food "${food.name}".`,
              });
            }
          } else {
            // If no size or piece is selected, calculate the default item price
            item.itemPrice = food.price * quantityOrdered;
          }

          // Apply discounts if available
          if (food.discount_type && food.discount_value) {
            let discountedPrice = item.itemPrice;

            if (food.discount_type === "percentage") {
              const discountPercentage = food.discount_value / 100;
              discountedPrice -= item.itemPrice * discountPercentage;
            } else if (food.discount_type === "amount") {
              discountedPrice -= food.discount_value * quantityOrdered;
            }

            // Assign the discounted price to the item
            item.itemPrice = discountedPrice;
          }

          // Check if addons are selected
          if (item.addons && item.addons.length > 0) {
            const addonsTotalPrice = await item.addons.reduce(
              async (addonsTotalPromise, addonId) => {
                const addon = await Addons.findById(addonId);

                if (!addon) {
                  return res.status(404).json({
                    message: `Addon with ID ${addonId} not found.`,
                  });
                }

                const total = await addonsTotalPromise;
                return total + addon.price;
              },
              Promise.resolve(0)
            );

            // Add addons total price to the item price
            item.itemPrice += addonsTotalPrice;
          }

          const stockUpdateResult = await updateStock(
            food.categoryId,
            orderDate,
            quantityOrdered
          );

          if (stockUpdateResult.error) {
            return res.status(400).json({
              message: `Stock for Food "${food.name}" is not available for the requested quantity.`,
            });
          }

          return item;
        })
      );

      const totalPriceWithDiscount = await newOrderItems.reduce(
        async (totalPromise, item) => {
          const total = await totalPromise;
          return total + item.itemPrice;
        },
        Promise.resolve(0)
      );

      const foodIdsObjectIds = await foodIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const foodAggregation = await Food.aggregate([
        { $match: { _id: { $in: foodIdsObjectIds } } },
        {
          $group: {
            _id: "$_id",
            maxPreparationTime: { $max: "$preparationTime" },
          },
        },
        { $sort: { maxPreparationTime: -1 } },
        { $limit: 1 },
      ]);

      const maxPreparationTime =
        foodAggregation.length > 0 ? foodAggregation[0].maxPreparationTime : 0;

      // Calculate total number of food items ordered
      const totalNumberOfFood = newOrderItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      // Create detailed order items for response
      const detailedOrderItems = newOrderItems.map((item) => ({
        foodId: item.foodId,
        size: item.size,
        sizeName: item.sizeName,
        pieces: item.pieces,
        pieceName: item.pieceName,
        quantity: item.quantity,
        itemPrice: item.itemPrice,
      }));

      const newOrder = new Order({
        table_no,
        status,
        payment_method,
        payment_status,
        items: newOrderItems,
        totalPrice: totalPriceWithDiscount,
        orderDate,
        totalNumberOfFood,
        averagePreparationTime: maxPreparationTime,
      });

      const savedOrder = await newOrder.save();

      // Send the response with detailed food items information
      res.status(201).json({
        order: savedOrder,
        detailedItems: detailedOrderItems,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createTableOrder : async (req, res) => {
    try {
      const { tableNumber, items, totalPrice, totalNumberOfFood, restaurantId } = req.body;
  
      const newOrder = new Order({
        tableNumber,
        items,
        totalPrice,
        totalNumberOfFood,
        restaurantId,
        status:'approved',
        paymentMethod: 'offline', 
        paymentStatus: 'approved', 
      });
  
      await newOrder.save();
      
      res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      console.error('Error creating order:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // -------------------------------------------------- Update A Order ------------------------------------------------
  // updateOrder: async (req, res) => {
  //   try {
  //     const orderId = req.params.id;
  //     const { table_no, status, payment_method, payment_status, items } =
  //       req.body;

  //     // Check if the order exists
  //     const existingOrder = await Order.findById(orderId);
  //     if (!existingOrder) {
  //       return res.status(404).json({
  //         message: `Order with ID ${orderId} not found.`,
  //       });
  //     }

  //     // Update order details
  //     existingOrder.table_no = table_no || existingOrder.table_no;
  //     existingOrder.status = status || existingOrder.status;
  //     existingOrder.payment_method =
  //       payment_method || existingOrder.payment_method;
  //     existingOrder.payment_status =
  //       payment_status || existingOrder.payment_status;

  //     // Update items
  //     if (items && items.length > 0) {
  //       existingOrder.items = await Promise.all(
  //         items.map(async (item) => {
  //           const foodId = item.foodId;
  //           const quantityOrdered = item.quantity;
  //           const food = await Food.findById(foodId);

  //           if (!food) {
  //             return res.status(404).json({
  //               message: `Food with ID ${foodId} not found.`,
  //             });
  //           }

  //           // Check if the user selected a size or piece
  //           if (item.size) {
  //             const selectedSize = food.sizes.find(
  //               (size) => size._id.toString() === item.size
  //             );

  //             if (selectedSize) {
  //               item.sizeName = selectedSize.size;
  //               item.itemPrice = selectedSize.price * quantityOrdered;
  //             } else {
  //               return res.status(400).json({
  //                 message: `Selected size not found for Food "${food.name}".`,
  //               });
  //             }
  //           } else if (item.pieces) {
  //             const selectedPieces = food.pieces.find(
  //               (piece) => piece._id.toString() === item.pieces
  //             );

  //             if (selectedPieces) {
  //               item.pieceName = selectedPieces.pieces;
  //               item.itemPrice = selectedPieces.price * quantityOrdered;
  //             } else {
  //               return res.status(400).json({
  //                 message: `Selected pieces not found for Food "${food.name}".`,
  //               });
  //             }
  //           } else {
  //             // If no size or piece is selected, calculate the default item price
  //             item.itemPrice = food.price * quantityOrdered;
  //           }

  //           // Apply discounts if available
  //           if (food.discount_type && food.discount_value) {
  //             let discountedPrice = item.itemPrice;

  //             if (food.discount_type === "percentage") {
  //               const discountPercentage = food.discount_value / 100;
  //               discountedPrice -= item.itemPrice * discountPercentage;
  //             } else if (food.discount_type === "amount") {
  //               discountedPrice -= food.discount_value * quantityOrdered;
  //             }

  //             // Assign the discounted price to the item
  //             item.itemPrice = discountedPrice;
  //           }

  //           // Check if addons are selected
  //           if (item.addons && item.addons.length > 0) {
  //             const addonsTotalPrice = await item.addons.reduce(
  //               async (addonsTotalPromise, addonId) => {
  //                 const addon = await Addons.findById(addonId);

  //                 if (!addon) {
  //                   return res.status(404).json({
  //                     message: `Addon with ID ${addonId} not found.`,
  //                   });
  //                 }

  //                 const total = await addonsTotalPromise;
  //                 return total + addon.price;
  //               },
  //               Promise.resolve(0)
  //             );

  //             // Add addons total price to the item price
  //             item.itemPrice += addonsTotalPrice;
  //           }

  //           // Assuming you have a function to update stock
  //           // Replace this with your actual implementation
  //           const stockUpdateResult = await updateStock(
  //             food.categoryId,
  //             existingOrder.orderDate,
  //             -existingOrder.items.find(
  //               (existingItem) => existingItem.foodId.toString() === foodId
  //             ).quantity
  //           );

  //           if (stockUpdateResult.error) {
  //             return res.status(400).json({
  //               message: `Stock for Food "${food.name}" is not available for the requested quantity.`,
  //             });
  //           }

  //           // Update stock for the new quantity
  //           const stockUpdateResultNew = await updateStock(
  //             food.categoryId,
  //             existingOrder.orderDate,
  //             quantityOrdered
  //           );

  //           if (stockUpdateResultNew.error) {
  //             return res.status(400).json({
  //               message: `Stock for Food "${food.name}" is not available for the requested quantity.`,
  //             });
  //           }

  //           return item;
  //         })
  //       );
  //     }

  //     // Save the updated order
  //     const updatedOrder = await existingOrder.save();

  //     res.status(200).json({
  //       order: updatedOrder,
  //       detailedItems: existingOrder.items, // Send the detailed items for the updated order
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // },

  //------------------------------------------------------- Update oder status ----------------------------
  updateOrderStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new CustomError("Failed to update order status!"));
      }
      const updatedOrder = await Order.updateOne({ _id: id }, req.body, {
        runValidators: true,
      });

      if (!updatedOrder.modifiedCount) {
        return next(new CustomError("Failed to update order statuus"));
      }

      res.status(200).json({
        status: "success",
        message: "Order status successfully updated",
      });
    } catch (error) {
      next(new CustomError(error.message, 400));
    }
  },
  // ---------------------------------------------------------------- Get a single order --------------------------
  singleOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const orders = await Order.findById(orderId)
        .populate({
          path: "items.foodId",
          select: "name price discount_price isOffer food_image",
        })
        .populate({
          path: "items.addons",
          select: "name price ",
        });
      res.status(200).json([orders]);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //----------------------------------------------------------------Get All Orders ----------------------------------------------------------------
  listOrder: async (req, res, next) => {
    try {
      const restaurantId = req.params.restaurantId;
      const orders = await Order.find({ restaurantId })
        // console.log(orders[5].items)
        .populate({
          path: "items.foodId",
          select: "name price discount_price isOffer food_image",
        })
        .populate({
          path: "items.addons",
          select: "name price ",
        });

      if (orders.length === 0) {
        next(new CustomError("No order founded", 404));
        return;
      }

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // ---------------------------------------------------------------- Delete order ---------------------------------------------------
  deleteOrder: async (req, res) => {
    try {
      const orderId = req.params.id;

      const deletedOrder = await Order.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getOrderHistorySummary: async (req, res) => {
    try {
      const orders = await Order.find().populate({
        path: "items.foodId",
        select: "name",
      });

      const foodOrderSummary = orders.reduce((summary, order) => {
        order.items.forEach((item) => {
          const foodName = item.foodId.name;

          if (summary[foodName]) {
            summary[foodName] += item.quantity;
          } else {
            summary[foodName] = item.quantity;
          }
        });

        return summary;
      }, {});

      const summaryArray = Object.entries(foodOrderSummary).map(
        ([name, item]) => ({
          name,
          item,
        })
      );

      res.status(200).json(summaryArray);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateStock: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findOne({ _id: orderId });
  
      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }
  
      const { restaurantId, items } = order;
  
      for (const item of items) {
        const { foodId, quantity } = item;
  
        const stockLimit = await Stock.findOne({
          restaurantId: restaurantId,
          "foodItems.food": foodId,
        });
  
        if (!stockLimit) {
          console.error(`Stock limit not found for restaurant ${restaurantId} and food ${foodId}`);
          return res.status(404).json({ error: `Stock limit not found for restaurant ${restaurantId} and food ${foodId}` });
        }
  
        const foodItemIndex = stockLimit.foodItems.findIndex(
          (stockItem) => stockItem.food.toString() === foodId.toString()
        );
  
        if (foodItemIndex === -1) {
          console.error(`Food item ${foodId} not found in stock limit for restaurant ${restaurantId}`);
          return res.status(404).json({ error: `Food item ${foodId} not found in stock limit for restaurant ${restaurantId}` });
        }
  
        stockLimit.foodItems[foodItemIndex].quantity -= quantity;
        await stockLimit.save();
      }
  
      res.status(200).json({ message: "Stock updated successfully." });
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

module.exports =  orderController;
