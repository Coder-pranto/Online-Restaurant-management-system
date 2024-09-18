const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const CustomError = require('./utils/customError'); // Ensure you have a custom error handler
const restaurantAdminServices = require('./services/restaurantAdminServices'); // Ensure you have this service


const updateRestaurantControllerx = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
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

        if (password) {
            if (password.length < 6) {
                throw new CustomError('Password must be at least 6 characters', 400);
            }
            const salt = await bcrypt.genSalt(10);
            restaurantAdmin.password = await bcrypt.hash(password, salt);
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

module.exports = {updateRestaurantControllerx};
