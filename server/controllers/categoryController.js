const Category = require("../model/categoryModel");
const fs = require("fs");
const { compressImage } = require("../utils/imageCompressor");

const categoryController = {
  // Create a new category
  createCategory: async (req, res) => {
    try {
      if (req.file) {
        // Compress the uploaded image
        await compressImage(req.file.path);

        // Proceed with category creation after image compression
        const { name, restaurantId } = req.body;
        const category_image = req.file.path;
        const category = new Category({ name, restaurantId, category_image });
        await category.save();
        res.status(201).json(category);
      } else {
        res.status(400).json({ message: "Image not provided" });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all categories
  listCategories: async (req, res) => {
    try {
      const categories = await Category.find({ restaurantId: req.query.restaurantId });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update a category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      let category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Handle image upload and compression if a new file is provided
      if (req.file) {
        // Delete the old image if it exists
        if (category.category_image && fs.existsSync(category.category_image)) {
          fs.unlinkSync(category.category_image);
        }

        // Compress the new image
        await compressImage(req.file.path);

        // Update category with the new image path
        category.category_image = req.file.path;
      }

      // Update category name
      category.name = name || category.name;

      await category.save();
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete a category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Delete the associated image file
      if ( fs.existsSync(category.category_image)) {
        fs.unlinkSync(category.category_image);
      }

      // Delete the category from the database
      await category.deleteOne();

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = categoryController;
