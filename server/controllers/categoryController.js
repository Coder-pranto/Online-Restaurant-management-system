const Category = require("../model/categoryModel");
const fs = require("fs");

const categoryController = {
  //Create A new category
  createCategory: async (req, res) => {
    try {
      if (req.file) {
        const { name, restaurantId } = req.body;
        const category_image = req.file.path;
        const category = new Category({ name, restaurantId, category_image });
        await category.save();
        res.status(201).json(category);
      } else {
        res.status(400).json({ message: "Image not provided" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Get All The Categories

  listCategories: async (req, res) => {
    try {
      const categories = await Category.find({restaurantId: req.query.restaurantId});
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Update a category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      let category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (req.file) {
        if (category.category_image) {
          fs.unlinkSync(category.category_image);
        }

        category.category_image = req.file.path;
      }

      category.name = name || category.name;

      await category.save();

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Delete a category

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Delete the associated image file
      if (fs.existsSync(category.category_image)) {
        fs.unlinkSync(category.category_image);
      }

      await category.deleteOne();

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = categoryController;
