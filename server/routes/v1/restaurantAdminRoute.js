const express = require('express');
const restaurantAdminController = require('../../controllers/restaurantAdminController');
const verifyJWTToken = require('../../middleware/userVerify');
const restaurantAdminRouter = express.Router();
const fileUpload = require("express-fileupload");
// Route for restaurant admin login
restaurantAdminRouter.post('/login', restaurantAdminController.loginController)

restaurantAdminRouter.use(verifyJWTToken('super_admin'));
restaurantAdminRouter.use(fileUpload());

// Route for creating a restaurant admin
restaurantAdminRouter.post(
    '/create', 
    restaurantAdminController.createRestaurantAdminController
);

// Route for getting all restaurant admins
restaurantAdminRouter.get(
    '/all',
    restaurantAdminController.getAllRestaurantAdminController
);
restaurantAdminRouter.get(
    '/:restaurantId',
    restaurantAdminController.getSpecificRestaurantAdminController
);

// // Route for update a restaurant admins
// restaurantAdminRouter.patch(
//     '/update/:restaurantId',
//     restaurantAdminController.updateARestaurantAdminController
// );

// // Route for update a restaurant admins
restaurantAdminRouter.patch(
    '/update/:restaurantId',
    restaurantAdminController.updateRestaurantController
);

// Route for delete a restaurant admins
restaurantAdminRouter.delete(
    '/delete/:restaurantId',
    restaurantAdminController.deleteARestaurantAdminController
);

// Route for update theme for a restaurant admins
restaurantAdminRouter.patch(
    '/update/theme/:restaurantId',
    restaurantAdminController.updateThemeAndLogoController
);

module.exports = restaurantAdminRouter;