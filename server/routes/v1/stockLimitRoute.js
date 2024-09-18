const express = require("express");
const stockLimitController = require("../../controllers/stockLimitController");
const verifyJWTToken = require("../../middleware/userVerify");

const router = express.Router();

//Create a new Stock Limit
router.post(
  "/",
  // verifyJWTToken('restaurant_admin'),
  stockLimitController.createStockLimit
);
//Get All Stock Limit
router.get(
  "/",
  verifyJWTToken('restaurant_admin', 'customer'),
   stockLimitController.listStockLimit
   );

//Update a Stock Limit
router.patch(
  "/:id",
  verifyJWTToken('restaurant_admin'),
  stockLimitController.updateStockLimit
);
//Delete a Stock Limit
router.delete("/:id", stockLimitController.deleteStockLimit);

module.exports = router;
