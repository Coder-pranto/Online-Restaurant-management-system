const Food = require("../model/foodModel");
const fs = require("fs");
// const mongoose = require("mongoose");

const foodController = {
  
  updateAllFoodItems: async (req, res) => {
    try {
      // const categoryId = req.params.id;

      // Update all documents in the "Food" collection
      const result = await Food.updateMany(
        {},
        {
          $set: {
            isPopular: false,
          },
        }
      );
      // Log the result of the update operation
      console.log(result);

      // Optionally, you can return a response or perform other actions
      res.json(result);
    } catch (error) {
      // Handle errors here
      console.error(error);
      throw error;
    }
  },
  //Add A new Food
  createFood: async (req, res) => {
    try {
      if (req.file) {
        const { name, categoryId, price, description, preparationTime, restaurantId } =
          req.body;

        let ingredients = req.body?.ingredients
          ? JSON.parse(req.body?.ingredients)
          : [];
        let spicyLevels = req.body?.spicyLevels
          ? JSON.parse(req.body.spicyLevels)
          : [];
        let sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
        let pieces = req.body.pieces ? JSON.parse(req.body.pieces) : [];

        const food_image = req.file.path;

        const food = new Food({
          name,
          categoryId,
          price,
          sizes,
          spicyLevels,
          pieces,
          discount_type: "",
          discount_value: 0,
          preparationTime: preparationTime ? preparationTime : 0,
          isOffer: false,
          isPopular: false,
          food_image,
          ingredients,
          description,
          restaurantId
        });
        console.log('from food controller', food)

        await food.save();
        res.status(201).json(food);
      } else {
        res.status(400).json({ message: "Image not provided" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  },

  //Get All the Food
  listFood: async (req, res) => {
    try {
      let query = {restaurantId: req.query.restaurantId};

      const food = await Food.find(query)

        .populate({
          path: "categoryId",
          select: "_id name",
        })

        .exec();

      // Check if search term is provided in the query parameters
      if (req.query.searchTerm) {
        const searchRegex = new RegExp(req.query.searchTerm, "i");

        // Filter the results based on the search term
        const filterFood = food.filter(
          (item) =>
            item.name.match(searchRegex) ||
            (item.categoryId && item.categoryId.name.match(searchRegex))
        );
        res.json(filterFood);
      } else {
        res.json(food);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Get a single food

  getFood: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId)

        .populate({
          path: "categoryId",
          select: "_id name",
        })

        .exec();

      if (!food) {
        return res.status(404).json({ message: "Food item not found" });
      }

      res.json([food]);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //Get  food by category

  getFoodByCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;

      // Query the database to find food items matching the specified category
      const foodItems = await Food.find({ categoryId: categoryId })
        .populate({
          path: "categoryId",
          select: "_id name",
        })

        .exec();

      if (!foodItems || foodItems.length === 0) {
        return res
          .status(404)
          .json({ message: "No food items found in this category" });
      }

      res.json(foodItems);
    } catch (error) {
      console.error("Error fetching food items by category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Update a food
  updateFood: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        categoryId,
        isPopular,
        price,
        description,
        preparationTime,
      } = req.body;
  
      let food = await Food.findOne({_id: id});
  
      if (!food) {
        return res.status(404).json({ message: "Food item not found" });
      }
  
      let ingredients = req.body?.ingredients
        ? JSON.parse(req.body?.ingredients)
        : [];
      let spicyLevels = req.body?.spicyLevels
        ? JSON.parse(req.body?.spicyLevels)
        : [];
      let sizes = req.body?.sizes ? JSON.parse(req.body?.sizes) : [];
      let pieces = req.body?.pieces ? JSON.parse(req.body?.pieces) : [];
  
      if (ingredients?.length >= 0) {
        food.ingredients = ingredients;
      }
      if (spicyLevels?.length >= 0) {
        food.spicyLevels = spicyLevels;
      }
  
      if (sizes.length >= 0) {
        food.sizes = sizes;
      }
  
      if (pieces.length >= 0) {
        food.pieces = pieces;
      }
  
      if (req.file) {
        if (food.food_image && fs.existsSync(food.food_image)) {
          fs.unlinkSync(food.food_image);
        }
  
        food.food_image = req.file.path;
      }
  
      food.name = name || food.name;
      food.isPopular = isPopular || food.isPopular;
      food.preparationTime = preparationTime || food.preparationTime;
      food.categoryId = categoryId || food.categoryId;
      food.price = price || food.price;
      food.description = description || food.description;
  
      await food.save();
  
      res.json(food);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  

  //Delete a food
  deleteFood: async (req, res) => {
    try {
      const { id } = req.params;
      let food = await Food.findById(id);

      if (!food) {
        return res.status(404).json({ message: "Food item not found" });
      }
      if (food.food_image && fs.existsSync(food.food_image)) {
        fs.unlinkSync(food.food_image);
      }

      await food.deleteOne();

      res.json({ message: "Food item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = foodController;
