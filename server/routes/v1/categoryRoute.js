const express = require("express");
const categoryController = require("../../controllers/categoryController");

const imageUpload = require("../../middleware/imageUpload");
const verifyJWTToken = require("../../middleware/userVerify");

const router = express.Router();

//Create a new category
router.post(
  "/",
  verifyJWTToken('restaurant_admin'),
  imageUpload.single("category_image"),
  categoryController.createCategory
);
//Get All Categories
router.get(
  "/",
  verifyJWTToken('restaurant_admin', 'customer'),
  categoryController.listCategories);

//Update a category
router.patch("/:id",verifyJWTToken('restaurant_admin'),imageUpload.single("category_image"),
  categoryController.updateCategory
);

//Delete a category
router.delete("/:id", verifyJWTToken('restaurant_admin'), categoryController.deleteCategory);

module.exports = router;
