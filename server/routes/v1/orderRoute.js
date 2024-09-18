const express = require("express");
const orderController = require("../../controllers/orderController");
const verifyJWTToken = require("../../middleware/userVerify");

const router = express.Router();

//Add a new order
router.post(
  "/",
  verifyJWTToken("restaurant_admin"),
  orderController.createOrder
);
//Get All orders
router.get(
  "/:restaurantId",
  verifyJWTToken("restaurant_admin", "customer"),
  orderController.listOrder
);
router.get(
  "/quantity",
  verifyJWTToken("restaurant_admin", "customer"),
  orderController.getOrderHistorySummary
);
//Get A Single order
router.get(
  "/single/:id",
  verifyJWTToken("restaurant_admin", "customer"),
  orderController.singleOrder
);
//Update a Single order
router.patch(
  "/:id",
  verifyJWTToken("restaurant_admin"),
  orderController.updateOrderStatus
);
//Delete a Single order
router.delete(
  "/:id",
  verifyJWTToken("restaurant_admin"),
  orderController.deleteOrder
);

//update stcok
router.patch(
  "/stock/:id",
  // verifyJWTToken("restaurant_admin","customer"),
  orderController.updateStock
);

module.exports = router;
