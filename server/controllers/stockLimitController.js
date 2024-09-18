const { default: mongoose } = require("mongoose");
const StockLimit = require("../model/StockLimit");
const Food = require("../model/foodModel");


const stockLimitController = {
  //Create A new category Limit
  createStockLimit: async (req, res) => {
    try {
      const { category, restaurantId, foodItems } = req.body;

      // Create an array to hold the food items with their quantities
      const foodItemsWithQuantities = [];

      for (const { foodId, quantity } of foodItems) {
        const food = await Food.findById(foodId);
        if (!food) {
          return res.status(400).json({ message: "Invalid Food ID" });
        }
        foodItemsWithQuantities.push({ food: food._id, quantity });
      }

      const stockLimit = new StockLimit({
        category,
        restaurantId,
        foodItems: foodItemsWithQuantities, 
      });

      await stockLimit.save();

      res.status(201).json(stockLimit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Get All The Stock Limit

  listStockLimit: async (req, res) => {
    try {
      const stockLimit = await StockLimit.find({restaurantId: req.query.restaurantId}).populate({
        path: "category",
        select: "_id name",
      }).populate({
        path: "foodItems.food",
        select: "_id name", 
      });
      res.json(stockLimit);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },


  // Update an existing stock limit
  updateStockLimit: async (req, res) => {
    try {
      const stockId = req.params.id;
      const { fromDate, toDate, limit } = req.body;

      if (!mongoose.Types.ObjectId.isValid(stockId)) {
        return res.status(400).json({ message: "Invalid Stock limit ID" });
      }

      // Find the existing stock limit by its ObjectId
      const existingStockLimit = await StockLimit.findById(stockId);

      // Check if the stock limit exists
      if (!existingStockLimit) {
        return res.status(404).json({ message: "Stock limit not found" });
      }

      // Calculate the difference between the new limit and the old limit
      const limitDifference = limit - existingStockLimit.limit;

      // Update the stock limit fields
      existingStockLimit.fromDate = fromDate || existingStockLimit.fromDate;
      existingStockLimit.toDate = toDate || existingStockLimit.toDate;

      // Check if the updated limit is less than zero
      if (limit < 0) {
        return res
          .status(400)
          .json({ message: "Limit cannot be less than zero" });
      }

      // Check if the updated left_over is less than zero
      if (existingStockLimit.left_over + limitDifference < 0) {
        return res.status(400).json({ message: "Stock is out" });
      }

      // Update the limit and left_over based on the limit difference
      existingStockLimit.limit = limit;
      existingStockLimit.left_over += limitDifference;

      // Save the updated stock limit
      await existingStockLimit.save();

      res.json(existingStockLimit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Delete a stock limit
  deleteStockLimit: async (req, res) => {
    try {
      const { id } = req.params;
      const stockLimit = await StockLimit.findById(id);

      if (!stockLimit) {
        return res.status(404).json({ message: "Stock is not found" });
      }

      await stockLimit.deleteOne();

      res.json({ message: "Stock deleted successfully" });
    } catch (error) {
      console.error("Error deleting Stock:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

};

module.exports = stockLimitController;
