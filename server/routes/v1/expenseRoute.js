const express = require("express");
const expenseController = require("../../controllers/expenseController");
const verifyJWTToken = require("../../middleware/userVerify");

const router = express.Router();

//Create a new Expense
router.post(
  "/",
  verifyJWTToken('restaurant_admin'),
  expenseController.createExpense
);
//Get All Expenses
router.get("/", verifyJWTToken('restaurant_admin', 'customer'), expenseController.listExpenses);

//Update a Expense
router.patch(
  "/:id",
  verifyJWTToken('restaurant_admin'),
  expenseController.updateExpense
);
//Delete a Expense
router.delete("/:id", verifyJWTToken('restaurant_admin'), expenseController.deleteExpense);

module.exports = router;
