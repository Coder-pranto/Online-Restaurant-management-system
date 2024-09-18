import { useState, useEffect, useMemo } from "react";

export default function LocationComparison() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationsToCompare, setLocationsToCompare] = useState({});
  const [distanceOfUser, setDistanceOfUser] = useState(0);
  const [isUserInTheArea, setIsUserInTheArea] = useState(false);
  const [locationError, setLocationError] = useState("");
  const radiusInMeters = 200;

  // useMemo(() => {
  //   const distanceDiff = radiusInMeters - distanceOfUser;
  //   if (0 < distanceDiff && distanceDiff < radiusInMeters)
  //     setIsUserInTheArea(true);
  //   else setIsUserInTheArea(false);
  // }, [distanceOfUser, radiusInMeters]);
  // // console.log(userLocation);

  const getLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch (error) {
        setLocationError(error.message || "Error getting user location");
      }
    } else {
      setLocationError("Location is not supported by this browser");
    }
  };

  useEffect(() => {
    getLocation();
    // if (navigator.geolocation) {
    //   navigator.permissions
    //     .query({
    //       name: "geolocation",
    //     })
    //     .then(function (result) {
    //       // console.log(result);
    //       if (result.state === "denied") {
    //         setLocationError(
    //           "Please allow device location to confirm your order!"
    //         );
    //       } else {
    //         // Get user's location
    //         navigator.geolocation.getCurrentPosition(
    //           (position) => {
    //             setUserLocation({
    //               latitude: position.coords.latitude,
    //               longitude: position.coords.longitude,
    //             });
    //           },
    //           (error) => {
    //             // console.error('Error getting user location:', error);
    //             setLocationError(error.message);
    //           }
    //           // { enableHighAccuracy: true }
    //         );

    //         // Set locations to compare
    //         setLocationsToCompare({
    //           latitude: 23.75776961239463,
    //           longitude: 90.36687386566688,
    //         });
    //       }
    //     });
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       setUserLocation({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       });
    //     },
    //     (error) => {
    //       // console.error('Error getting user location:', error);
    //       setLocationError(error.message);
    //     }
    //     // { enableHighAccuracy: true }
    //   );
    // } else {
    //   setLocationError("Location is not supported by this browser");
    // }
  }, []);

  // useEffect(() => {
  //   if (userLocation) {
  //     // Calculate distance and filter locations within radius
  //     const distance = calculateDistance(
  //       userLocation.latitude,
  //       userLocation.longitude,
  //       locationsToCompare.latitude,
  //       locationsToCompare.longitude
  //     );
  //     setDistanceOfUser(distance.toFixed(2));
  //     // return distance <= radiusInMeters;
  //   }
  // }, [userLocation, locationsToCompare, radiusInMeters]);

  // Function to calculate distance between two points using Haversine formula
  // const calculateDistance = (lat1, lon1, lat2, lon2) => {
  //   const R = 6371e3;
  //   const φ1 = (lat1 * Math.PI) / 180;
  //   const φ2 = (lat2 * Math.PI) / 180;
  //   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  //   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  //   const a =
  //     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
  //     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //   const distance = R * c;
  //   return distance;
  // };

  return { isUserInTheArea, locationError, userLocation };
}
