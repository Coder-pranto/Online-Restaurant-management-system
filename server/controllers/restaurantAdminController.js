const restaurantAdminServices = require("../services/restaurantAdminServices");
const bcrypt = require('bcrypt');
const CustomError = require("../utils/customError");
const generateRestaurantUniqueId = require("../utils/generateRestaurantUniqueId");
const generateJwtToken = require("../utils/generateJwtToken");
const fs = require('fs');
const path = require('path');

// create restaurant admin controller by super admin
const createRestaurantAdminController = async (req, res, next) => {
    try {
        const restaurantId = await generateRestaurantUniqueId();
        const restaurantAdminInfo = { ...req.body, restaurantId };
        // console.log(restaurantAdminInfo)
        const newRestaurantAdmin = await restaurantAdminServices.createRestaurantAdminService(restaurantAdminInfo);
        if (!newRestaurantAdmin) {
            next(new CustomError('Failed to create new restaurant admin', 400));
            return;
        };

        const { password: pwd, ...newRestaurantAdminWithoutPass } = newRestaurantAdmin.toObject();
        res.status(201).json({
            status: "success",
            message: "Restaurant admin successfully created",
            data: newRestaurantAdminWithoutPass
        });

    } catch (error) {
        const err = new CustomError(error.message, 400);
        next(err);
    }
}

// get all restaurant admin controller by super admin
const getAllRestaurantAdminController = async (req, res, next) => {
    try {
        const { pageNumber = 1, pageSize = 7} = req.query;
        const restaurantAdmins = await restaurantAdminServices.getAllRestaurantAdminService(pageNumber, pageSize);
        // if not found, send error response
        if (restaurantAdmins.result.length === 0) {
            next(new CustomError('Couldn\'t found any restaurant admins', 404));
            return;
        }
        // Convert each Mongoose document to a plain JavaScript object
        const restaurantAdminsWithoutPass = restaurantAdmins.result.map(admin => {
            let { password: pwd, ...adminWithoutPass } = admin.toObject();
            adminWithoutPass = {
                ...adminWithoutPass,
                totalPage: restaurantAdmins.totalPage
            };
            return adminWithoutPass;
        });
        // send success response
        res.status(200).json({
            status: "success",
            message: "Restaurant admins successfully founded",
            data: restaurantAdminsWithoutPass
        });
    } catch (error) {
        next(new CustomError(error.message, 400))
    }
}

// get single restaurant admin controller by super admin
const getSpecificRestaurantAdminController = async (req, res, next) => {
    try {
        const restaurantAdmin = await restaurantAdminServices.getSpecificRestaurantAdminService(req.params.restaurantId);
        // if not found, send error response
        if (!restaurantAdmin) {
            next(new CustomError('Couldn\'t found any restaurant admins', 404));
            return;
        }
        // Convert each Mongoose document to a plain JavaScript object
        let { password: pwd, ...adminWithoutPass } = restaurantAdmin.toObject();

        // send success response
        res.status(200).json({
            status: "success",
            message: "Restaurant admin successfully founded",
            data: adminWithoutPass
        });
    } catch (error) {
        next(new CustomError(error.message, 400))
    }
}

// update a restaurant admin controller by super admin
// const updateARestaurantAdminController = async (req, res, next) => {
//     try {
//         const restaurantAdmin = await restaurantAdminServices.updateARestaurantAdminService(req.params.restaurantId, req.body);

//         // if not found, send error response
//         if (!restaurantAdmin) {
//             next(new CustomError('Update failed', 404));
//             return;
//         }

//         // send success response
//         res.status(200).json({
//             status: "success",
//             message: "Update successful",
//             data: restaurantAdmin
//         });
//     } catch (error) {
//         next(new CustomError(error.message, 400))
//     }
// }

const updateRestaurantController = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        console.log(restaurantId)
        const {
            email,
            password,
            restaurantName,
            adminName,
            status,
            restaurantCoords,
            restaurantRadius,
            address,
            mobileNumber,
            themeColor,
            secondaryColor
        } = req.body;

        let logo;

        // Check if the restaurant admin exists
        const restaurantAdmin = await restaurantAdminServices.getSpecificRestaurantAdminService(restaurantId);
        if (!restaurantAdmin) {
            return res.status(404).json({ status: "failed", message: 'Couldn\'t find any restaurant admins' });
        }

        // Check if there's a file upload for the logo
        if (req.files && req.files.logo) {

            // Delete the old image
            const imagePath = path.join(__dirname, '../Images', restaurantAdmin.logo);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                } else {
                    console.log('Image deleted successfully');
                }
            });
            const uploadedLogo = req.files.logo;

            if (!uploadedLogo.mimetype.startsWith('image')) {
                next(new CustomError('Please upload an image file for the logo', 401));
                return;
            }

            const maxSize = 1024 * 1024; // 1MB

            if (uploadedLogo.size > maxSize) {
                next(new CustomError('Please upload an image smaller than 1MB for the logo'));
                return;
            }

            // Define the upload path for the logo
            const logoPath = path.join(__dirname, '../Images/restaurantLogos/', `${uploadedLogo.name}`);
            // Move the uploaded logo to the defined path
            await uploadedLogo.mv(logoPath);

            // Set the logo variable to the path of the uploaded logo
            logo = `/restaurantLogos/${uploadedLogo.name}`;
        }

        // Update the fields
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new CustomError('Invalid email address', 400);
            }
            restaurantAdmin.email = email;
        }

        // if (password) {
        //     if (password.length < 6) {
        //         throw new CustomError('Password must be at least 6 characters', 400);
        //     }
        //     const salt = await bcrypt.genSalt(10);
        //     restaurantAdmin.password = await bcrypt.hash(password, salt);
        // }
        if (password) {
            if (password.length < 6) {
                throw new CustomError('Password must be at least 6 characters', 400);
            }
           
            restaurantAdmin.password = password;
        }

        restaurantAdmin.restaurantName = restaurantName || restaurantAdmin.restaurantName;
        restaurantAdmin.adminName = adminName || restaurantAdmin.adminName;
        restaurantAdmin.status = status || restaurantAdmin.status;

        if (restaurantCoords) {
            if (!restaurantCoords.latitude || !restaurantCoords.longitude) {
                throw new CustomError('Invalid restaurant coordinates', 400);
            }
            restaurantAdmin.restaurantCoords = restaurantCoords;
        }

        if (restaurantRadius) {
            if (!restaurantRadius.value || isNaN(restaurantRadius.value)) {
                throw new CustomError('Invalid restaurant radius value. Must be a number.', 400);
            }
            restaurantAdmin.restaurantRadius = restaurantRadius;
        }

        restaurantAdmin.address = address || restaurantAdmin.address;
        restaurantAdmin.mobileNumber = mobileNumber || restaurantAdmin.mobileNumber;
        restaurantAdmin.themeColor = themeColor || restaurantAdmin.themeColor;
        restaurantAdmin.secondaryColor = secondaryColor || restaurantAdmin.secondaryColor;
        restaurantAdmin.logo = logo || restaurantAdmin.logo;

        await restaurantAdmin.save();

        res.status(200).json({
            status: "success",
            message: "Restaurant updated successfully",
            data: restaurantAdmin
        });
    } catch (error) {
        next(new CustomError(error.message, 400));
    }
}



// delete a restaurant admin controller by super admin
const deleteARestaurantAdminController = async (req, res, next) => {
    try {
        const restaurantAdmin = await restaurantAdminServices.deleteARestaurantAdminService(req.params.restaurantId);

        // Check if restaurantAdmin exists to determine if the delete was successful
        if (!restaurantAdmin) {
            next(new CustomError('Delete failed', 404));
            return;
        }

        // Send success response
        res.status(200).json({
            status: 'success',
            message: 'Delete successful',
            data: restaurantAdmin
        });
    } catch (error) {
        next(new CustomError(error.message, 400))
    }
}


// restaurant admin login
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // find the user from database
        const user = await restaurantAdminServices.getRestaurantAdminService(email);
        console.log(user)

        // If the user not found, return an error
        if (!user) {
            return res.status(401).json({status: "failed",message: 'Invalid email.'})
        }

        // Compared the provided password with the stored hashed password. If not matched, return an error.
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({status: "failed",message: 'Invalid password.'})
        }

        // if (password !== user.password) {
        //     return res.status(401).json({status: "failed",message: 'Invalid password.'})
        // }

        // generate jwt token
        const token = generateJwtToken({email, role: 'restaurant_admin'})

        const restaurantAdminSendableInfo = {
            restaurantId: user.restaurantId,
            restaurantName: user.restaurantName,
            token,
        }
        res.status(200).json({status: "success",message: 'Login successfull',data: restaurantAdminSendableInfo})
                                 
    } catch (error) {
        const err = new CustomError(error.message, 400);
        next(err);
    }
}


// restaurant admin panel theme color and logo update
const updateThemeAndLogoController = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { themeColor, secondaryColor } = req.body;
        let logo;

        // Check if the restaurant admin exists
        const restaurantAdmin = await restaurantAdminServices.getSpecificRestaurantAdminService(restaurantId);
        if (!restaurantAdmin) {
            res.status(404).json({status: "failed",message: 'Couldn\'t found any restaurant admins'})
        }

        // Check if there's a file upload for the logo
        if (req.files && req.files.logo) {
          // Delete the old image
          const imagePath = path.join(__dirname, '../Images', restaurantAdmin.logo);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Error deleting image:', err);
            } else {
              console.log('Image deleted successfully');
            }
          });
          const uploadedLogo = req.files.logo;

          if (!uploadedLogo.mimetype.startsWith('image')) {
            next(
              new CustomError('Please upload an image file for the logo', 401)
            );
            return;
          }

          const maxSize = 1024 * 1024; // 1MB

          if (uploadedLogo.size > maxSize) {
            next(new CustomError('Please upload an image smaller than 1MB for the logo'));
            return;
          }

          // Define the upload path for the logo
          const logoPath = path.join(__dirname,'../Images/restaurantLogos/' + `${uploadedLogo.name}` );
          // Move the uploaded logo to the defined path
          await uploadedLogo.mv(logoPath);

          // Set the logo variable to the path of the uploaded logo
          logo = `/restaurantLogos/${uploadedLogo.name}`;
        }

        restaurantAdmin.themeColor = themeColor || restaurantAdmin.themeColor;
        restaurantAdmin.secondaryColor = secondaryColor || restaurantAdmin.secondaryColor;
        restaurantAdmin.logo = logo || restaurantAdmin.logo;

        await restaurantAdmin.save();

        res.status(200).json({
            status: "success",
            message: "Theme color, secondary color, and logo updated successfully",
            data: restaurantAdmin
        });
    } catch (error) {
        next(new CustomError(error.message, 400));
    }
}


module.exports = {
    createRestaurantAdminController,
    getAllRestaurantAdminController,
    getSpecificRestaurantAdminController,
    // updateARestaurantAdminController,
    updateRestaurantController,
    deleteARestaurantAdminController,
    loginController,
    updateThemeAndLogoController,
}