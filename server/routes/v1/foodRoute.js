const express = require("express");
const foodController = require("../../controllers/foodController");
const imageUpload = require("../../middleware/imageUpload");
const verifyJWTToken = require("../../middleware/userVerify");

const router = express.Router();

//Add a new Food
// router.post("/", verifyJWTToken('restaurant_admin'), imageUpload.fields([{ name: 'food_image', maxCount: 1 }, { name: 'food_video', maxCount: 1 }]), foodController.createFood);

router.post("/", verifyJWTToken('restaurant_admin'), imageUpload.single("food_image"), foodController.createFood);


//Get All Foods
router.get("/", verifyJWTToken('restaurant_admin', 'customer'), foodController.listFood);

//Get Food by category
router.get("/category/:id", verifyJWTToken('restaurant_admin', 'customer'), foodController.getFoodByCategory);

//Get A single Food
router.get("/:id", verifyJWTToken('restaurant_admin', 'customer'), foodController.getFood);


//Update a Food
// router.patch(
//   "/:id",
//   verifyJWTToken('restaurant_admin'),
//   imageUpload.fields([{ name: 'food_image', maxCount: 1 }, { name: 'food_video', maxCount: 1 }]),
//   foodController.updateFood
// );

router.patch(
  "/:id",
  verifyJWTToken('restaurant_admin'),
  imageUpload.single("food_image"),
  foodController.updateFood
);

//Delete a Food
router.delete("/:id", verifyJWTToken('restaurant_admin'), foodController.deleteFood);

module.exports = router;
