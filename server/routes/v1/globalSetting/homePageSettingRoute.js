const express = require("express");
const homePageController = require("../../../controllers/globalSetting/homePageController");

const imageUpload = require("../../../middleware/imageUpload");

const router = express.Router();

//Create a new Home Page Settings
router.post("/", imageUpload.single("homePageImage"),homePageController.createHomePageSetting);

//Get Home Page Settings
router.get("/", homePageController.getHomePageSetting);

//Update Home Page Settings
router.patch( "/:id",imageUpload.single("homePageImage"),homePageController.updateHomePageSetting);
 
//Delete a Home Page Settings
router.delete("/:id", homePageController.deleteHomePageSetting);

module.exports = router;
