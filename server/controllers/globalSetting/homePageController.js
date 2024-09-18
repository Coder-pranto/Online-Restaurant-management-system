const HomePage = require("../../model/globalSetting/homePageModel");
const fs = require("fs");

const homePageController = {
  //Create A new Home Page Settings Controller
  createHomePageSetting: async (req, res) => {
    try {
      if (req.file) {
        const { name, restaurantId } = req.body;
        const homePageImage = req.file.path;
        const homePageSetting = new HomePage({ name, restaurantId, homePageImage });
        await homePageSetting.save();
        res.status(201).json(homePageSetting);
      } else {
        res.status(400).json({ message: "Image not provided" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get Home Page Settings
  getHomePageSetting: async (req, res) => {
    try {
      const homePageSetting = await HomePage.find({restaurantId: req.query.restaurantId});
      res.json(homePageSetting);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //Update a Home Page Settings
  updateHomePageSetting: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      let homePageSetting = await HomePage.findById(id);

      if (!homePageSetting) {
        return res
          .status(404)
          .json({ message: "Home Page Setting is not found" });
      }

      if (req.file) {
        if (
          homePageSetting.homePageImage &&
          fs.existsSync(homePageSetting.homePageImage)
        ) {
          fs.unlinkSync(homePageSetting.homePageImage);
        }

        homePageSetting.homePageImage = req.file.path;
      }
      homePageSetting.name = name || homePageSetting.name;

      await homePageSetting.save();

      res.json(homePageSetting);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Delete a Home Page Settings

  deleteHomePageSetting: async (req, res) => {
    try {
      const { id } = req.params;
      const homePageSetting = await HomePage.findById(id);

      if (!homePageSetting) {
        return res
          .status(404)
          .json({ message: "Home Page Setting is not found" });
      }

      // Delete the associated image file
      if (fs.existsSync(homePageSetting.homePageImage)) {
        fs.unlinkSync(homePageSetting.homePageImage);
      }

      await homePageSetting.deleteOne();

      res.json({ message: "Home Page Setting is deleted successfully" });
    } catch (error) {
      console.error("Error deleting Home Page Setting :", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = homePageController;
