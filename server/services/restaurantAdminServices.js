const RestaurantAdmin = require("../model/restaurantAdminModel");

// get last created restaurant id
const getLastRestaurantIdService = async () => {
    const result = await RestaurantAdmin.findOne({}).sort({ createdAt: -1 }).select('restaurantId')
    if (result) {
        return result.restaurantId;
    } else {
        return '0000';
    }
}
// get restaurant coords and radius
const getRestaurantCoordsandRadiusService = async (restaurantId) => {
    const result = await RestaurantAdmin.findOne({ restaurantId }).select('restaurantCoords restaurantRadius')
    return result;
}

// create restaurant admin service by super admin
const createRestaurantAdminService = async (data) => {
    const result = await RestaurantAdmin.create(data);
    return result;
}

// get all restaurant admin service by super admin
const getAllRestaurantAdminService = async (page, pageSize) => {
    const skip = (page - 1) * pageSize
    const result = await RestaurantAdmin.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    const totalCount = await RestaurantAdmin.countDocuments({});
    const totalPage = Math.ceil(totalCount / (Number(pageSize)));
    return {result, totalPage};
}

// get specific restaurant admin service by super admin
const getSpecificRestaurantAdminService = async(restaurantId) => {
    const result = await RestaurantAdmin.findOne({restaurantId});
    console.log(result);
    return result;
}

// update a restaurant admin service by super admin
const updateARestaurantAdminService = async (restaurantId, data) => {
    const result = await RestaurantAdmin.updateOne({ restaurantId }, data, {
        runValidators: true
    });
    return result;
}

// delete a restaurant admin service by super admin
const deleteARestaurantAdminService = async (restaurantId) => {
    const result = await RestaurantAdmin.deleteOne({ restaurantId });
    return result;
}

// get single restaurant admin with email
const getRestaurantAdminService = async (email) => {
    const result = await RestaurantAdmin.findOne({ email })
    return result;
}

module.exports = {
    getLastRestaurantIdService,
    getRestaurantCoordsandRadiusService,
    createRestaurantAdminService,
    getAllRestaurantAdminService,
    getSpecificRestaurantAdminService,
    updateARestaurantAdminService,
    deleteARestaurantAdminService,
    getRestaurantAdminService
}