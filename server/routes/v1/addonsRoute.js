const express = require("express");
const addonsController = require("../../controllers/addonsController");

const imageUpload = require("../../middleware/imageUpload");
const verifyJWTToken = require("../../middleware/userVerify");

const router = express.Router();

//Create a new addons
router.post(
  "/",
  verifyJWTToken('restaurant_admin'),
  imageUpload.single("addonsImage"),
  addonsController.createAddons
);
//Get All addons
router.get("/", verifyJWTToken('restaurant_admin', 'customer'), addonsController.listAddons);
//Get  addons By Category Id
router.get("/:id", verifyJWTToken('restaurant_admin', 'customer'), addonsController.addonByCategoryId);

//Update a Addon
router.patch(
  "/:id",
  verifyJWTToken('restaurant_admin'),
  imageUpload.single("addonsImage"),
  addonsController.updateAddons
);
// //Delete a Addons
router.delete("/:id", verifyJWTToken('restaurant_admin'), addonsController.deleteAddons);

module.exports = router;
