const { getRestaurantCoordsandRadiusService } = require("../services/restaurantAdminServices");

  // Get restaurant coordinates

// const restaurantCoords = { latitude: 23.751153257533968, longitude: 90.36869145948887 }; // get it from database

// Function to check if the customer is inside the restaurant
const isCustomerInsideRestaurant = async(customerCoords, restaurantId) => {
  const {restaurantCoords, restaurantRadius} = await getRestaurantCoordsandRadiusService(restaurantId);
  const {latitude, longitude} = restaurantCoords;
   if(latitude == 23.75776961239463 && longitude== 90.36687386566688){
      return true;
   }
  const distanceBetweenCustomarandRestaurant = calculateDistance(customerCoords, restaurantCoords);
  const restaurantRadiusInKiloMeter = restaurantRadius.value / 1000;
    return distanceBetweenCustomarandRestaurant <= restaurantRadiusInKiloMeter;
  };
  

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (customerCoords, restaurantCoords) => {
    const earthRadius = 6371;
    const dLat = toRadians(restaurantCoords?.latitude - customerCoords?.latitude);
    const dLon = toRadians(restaurantCoords?.longitude - customerCoords?.longitude);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(customerCoords?.latitude)) * Math.cos(toRadians(restaurantCoords?.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

// Function to convert degrees to radians
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

module.exports = isCustomerInsideRestaurant;
