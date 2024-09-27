const express = require("express");
const router = express.Router();

const categoryRoute = require("./categoryRoute");
const foodRoute = require("./foodRoute");
const addonsRoute = require("./addonsRoute");
const offerRoute = require("./offerRoute");
const orderRoute = require("./orderRoute");
const expenseRoute = require("./expenseRoute");
const stockLimitRoute = require("./stockLimitRoute");
const employeeRoute = require("./employeeRoutes");
const homePageSettingRoute = require("./globalSetting/homePageSettingRoute");
const qrCodeGeneratingRouter = require("./qrCodeGeneratingRoute");
const restaurantAdminRouter = require("./restaurantAdminRoute");
const superAdminRouter = require("./superAdminRoute");
const verifyJWTToken = require("../../middleware/userVerify");


router.use("/home_page_settings", homePageSettingRoute);
router.use("/category", categoryRoute);
router.use("/stock_limit", stockLimitRoute);
router.use("/food", foodRoute);
router.use("/addons", addonsRoute);
router.use("/offer", offerRoute);
router.use("/order", orderRoute);
router.use("/expense", expenseRoute);
router.use("/employee", employeeRoute);
router.use("/super-admin", superAdminRouter);
router.use("/restaurant-admin",restaurantAdminRouter);
router.use('/generateQrCode', qrCodeGeneratingRouter);

// const {updateRestaurantControllerx} = require('../../temp');
// const fileUpload = require("express-fileupload");
// const route = router.patch('/:restaurantId', updateRestaurantControllerx);
// route.use(fileUpload());
// router.use('/xyz',route);

module.exports = router;
