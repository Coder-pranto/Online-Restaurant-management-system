const express = require("express");
const imageUpload = require("../../middleware/imageUpload");
const employeeController = require("../../controllers/employeeController");
const { checkJwt } = require("../../middleware/userVerify");
const verifyJWTToken = require("../../middleware/userVerify");

const router = express.Router();

//Create Employee
router.post(
  "/",
  verifyJWTToken('restaurant_admin'),
  imageUpload.single("employeeImage"),
  employeeController.createEmployee
);
//Get All Employees
router.get("/", verifyJWTToken('restaurant_admin'), employeeController.listEmployees);
//Update an Employee
router.patch(
  "/:id",
  verifyJWTToken('restaurant_admin'),
  imageUpload.single("employeeImage"),
  employeeController.updateEmployee
);

//Delete An Employee
router.delete("/:id", verifyJWTToken('restaurant_admin'), employeeController.deleteEmployee);
module.exports = router;
