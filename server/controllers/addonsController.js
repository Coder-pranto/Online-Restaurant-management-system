

const Addons = require("../model/addonsModel");
const fs = require("fs");
const { compressImage } = require("../utils/imageCompressor"); // Assuming you have this utility function

const addonsController = {
  // Create a new addon
  createAddons: async (req, res) => {
    try {
      if (req.file) {
        // Compress the uploaded image
        await compressImage(req.file.path);

        const { name, category, price, restaurantId } = req.body;
        const addonsImage = req.file.path;
        const addons = new Addons({ name, addonsImage, category, price, restaurantId });
        await addons.save();
        res.status(201).json(addons);
      } else {
        res.status(400).json({ message: "Image not provided" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all addons
  listAddons: async (req, res) => {
    try {
      const addons = await Addons.find({ restaurantId: req.query.restaurantId })
        .populate("category", "_id name")
        .exec();
      if (!addons) {
        return res.status(404).json({ message: "Addons not found" });
      }
      res.json(addons);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get addons by category ID
  addonByCategoryId: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const addons = await Addons.find({ category: categoryId })
        .populate("category", "_id name")
        .exec();
      if (!addons) {
        return res.status(404).json({ message: "Addons not found" });
      }
      res.json(addons);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update an addon
  updateAddons: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, category } = req.body;
      let addons = await Addons.findById(id);

      if (!addons) {
        return res.status(404).json({ message: "Addons not found" });
      }

      if (req.file) {
        // Delete the old image if it exists
        if (addons.addonsImage && fs.existsSync(addons.addonsImage)) {
          fs.unlinkSync(addons.addonsImage);
        }

        // Compress the new image
        await compressImage(req.file.path);

        // Update the image path
        addons.addonsImage = req.file.path;
      }

      // Update the other fields
      addons.name = name || addons.name;
      addons.price = price || addons.price;
      addons.category = category || addons.category;

      await addons.save();

      res.json(addons);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  },

  // Delete an addon
  deleteAddons: async (req, res) => {
    try {
      const { id } = req.params;
      const addons = await Addons.findById(id);

      if (!addons) {
        return res.status(404).json({ message: "Addons not found" });
      }

      // Delete the associated image file
      if (addons.addonsImage && fs.existsSync(addons.addonsImage)) {
        fs.unlinkSync(addons.addonsImage);
      }

      await addons.deleteOne();

      res.json({ message: "Addons deleted successfully" });
    } catch (error) {
      console.error("Error deleting Addons:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = addonsController;
