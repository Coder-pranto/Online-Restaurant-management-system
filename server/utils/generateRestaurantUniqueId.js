const getLastRestaurantIdService = require("../services/restaurantAdminServices").getLastRestaurantIdService;


const generateRestaurantUniqueId = async () => {
    const lastRestaurantId = await getLastRestaurantIdService();
    const incrementedId = (parseInt(lastRestaurantId.substring(11) || '0000', 10) + 1).toString();
    const newRestaurantId = incrementedId.padStart(4, '0');
    return `DESHIT-RES-${newRestaurantId}`;
}

module.exports = generateRestaurantUniqueId;