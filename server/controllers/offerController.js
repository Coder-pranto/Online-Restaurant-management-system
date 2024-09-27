
// // // Function to delete expired offers and reset food discounts
// // async function deleteExpiredOffers(req, res) {
// //   try {
// //     const currentDate = new Date();
// //     const expiredOffers = await Offer.find({ end_date: { $lte: currentDate } });

// //     if (expiredOffers.length > 0) {
// //       const deletedOfferIds = expiredOffers.map((offer) => offer._id);

// //       // Delete expired offers from the database
// //       const deleteResult = await Offer.deleteMany({
// //         _id: { $in: deletedOfferIds },
// //       });

// //       if (deleteResult.deletedCount > 0) {
// //         const deletedOffersDetails = [];

// //         // Iterate through the deleted offer IDs to handle associated tasks
// //         for (const offerId of deletedOfferIds) {
// //           const offer = expiredOffers.find((offer) =>
// //             offer._id.equals(offerId)
// //           );

// //           // Handle associated tasks (e.g., remove food discounts, delete image files)
// //           for (const discount of offer.food_discounts) {
// //             const food = await Food.findById(discount.food_id);
// //             if (food) {
// //               food.discount_price = "0";
// //               food.isOffer = false;
// //               await food.save();
// //             }
// //           }

// //           // Delete the offer image file if it exists
// //           if (offer.offer_image && fs.existsSync(offer.offer_image)) {
// //             fs.unlinkSync(offer.offer_image);
// //           }

// //           deletedOffersDetails.push({
// //             offerId: offer._id,
// //             offerName: offer.offer_name,
// //           });
// //         }

// //         res.status(200).json({
// //           message: `${deleteResult.deletedCount} expired offers deleted`,
// //           deletedOffers: deletedOffersDetails,
// //         });
// //       } else {
// //         res.status(404).json({ message: "No expired offers found" });
// //       }
// //     } else {
// //       res.status(404).json({ message: "No expired offers found" });
// //     }
// //   } catch (error) {
// //     console.error("Error deleting expired offers:", error);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // }

// // // Schedule a task to run daily at midnight
// // cron.schedule("40 16 * * *", () => deleteExpiredOffers(null, null)); // Passing null, null for req, res as they are not used



const Offer = require("../model/offerModel");
const cron = require("node-cron");
const Food = require("../model/foodModel");
const fs = require("fs");
const { compressImage } = require("../utils/imageCompressor"); // Import the image compression utility

// Define the updateProductDiscounts function
async function updateProductDiscounts() {
  try {
    const Foods = await Food.find({});
    for (const food of Foods) {
      const hasFoodInOffer = await Offer.exists({ food_ids: food._id });
      if (!hasFoodInOffer) {
        food.discount_type = "";
        food.discount_value = 0;
        food.isOffer = false;
        await food.save();
      }
    }
  } catch (error) {
    console.error("Error updating product discounts:", error);
  }
}

const offerController = {
  // Create a new offer
  createOffer: async (req, res) => {
    try {
      if (req.file) {
        // Compress the uploaded image
        await compressImage(req.file.path);

        const offer_image = req.file.path;
        const { type, value, start_date, end_date, offer_name, restaurantId } = req.body;
        let food_ids = req.body.food_ids ? JSON.parse(req.body.food_ids) : [];
        
        const foods = await Food.find({ _id: { $in: food_ids } });
        
        if (foods.length !== food_ids.length) {
          return res.status(404).json({ message: "One or more food items not found" });
        }

        const food_discount_ids = foods.map((food) => food._id);

        // Create the offer with the compressed image
        const offer = new Offer({
          discount_type: type,
          discount_value: value,
          isPopular: false,
          food_ids: food_discount_ids,
          start_date,
          end_date,
          offer_name,
          offer_image,
          restaurantId
        });

        await offer.save();

        // Apply the discount to the associated foods
        for (const food of foods) {
          food.discount_type = type;
          food.discount_value = value;
          food.isOffer = true;
          food.restaurantId = restaurantId;
          await food.save();
        }

        res.status(201).json(offer);
      } else {
        res.status(400).json({ message: "Image not provided" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update an offer
  updateOffer: async (req, res) => {
    try {
      const offer_id = req.params.id;
      const { type, value, start_date, end_date, offer_name, isPopular } = req.body;
      let food_ids = req.body.food_ids ? JSON.parse(req.body.food_ids) : [];
      const foods = await Food.find({ _id: { $in: food_ids } });

      if (foods.length !== food_ids.length) {
        return res.status(404).json({ message: "One or more food items not found" });
      }

      const existingOffer = await Offer.findById(offer_id);

      if (!existingOffer) {
        return res.status(404).json({ message: "Offer not found" });
      }

      // Update the offer data
      existingOffer.discount_type = type || existingOffer.discount_type;
      existingOffer.food_ids = food_ids || existingOffer.food_ids;
      existingOffer.discount_value = value || existingOffer.discount_value;
      existingOffer.start_date = start_date || existingOffer.start_date;
      existingOffer.isPopular = isPopular || existingOffer.isPopular;
      existingOffer.end_date = end_date || existingOffer.end_date;
      existingOffer.offer_name = offer_name || existingOffer.offer_name;

      // Check if a new image is provided
      if (req.file) {
        if (existingOffer.offer_image && fs.existsSync(existingOffer.offer_image)) {
          fs.unlinkSync(existingOffer.offer_image);
        }

        // Compress the new image
        await compressImage(req.file.path);
        existingOffer.offer_image = req.file.path;
      }

      // Save the updated offer
      await existingOffer.save();

      // Apply the discount prices to the associated food items
      for (const food of foods) {
        food.discount_type = existingOffer.discount_type;
        food.discount_value = existingOffer.discount_value;
        food.isOffer = true;
        await food.save();
      }

      updateProductDiscounts();
      res.status(200).json(existingOffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete an offer
  deleteOffer: async (req, res) => {
    try {
      const { id } = req.params;

      const offer = await Offer.findById(id);

      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }

      // Reset the discount prices of associated food items
      for (const discount of offer.food_ids) {
        const food = await Food.findById(discount);
        if (food) {
          food.discount_type = "";
          food.discount_value = 0;
          food.isOffer = false;
          await food.save();
        }
      }

      // Delete the associated image file
      if (offer.offer_image && fs.existsSync(offer.offer_image)) {
        fs.unlinkSync(offer.offer_image);
      }

      // Delete the offer
      await offer.deleteOne();

      res.json({ message: "Offer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // List all offers
  listOffer: async (req, res) => {
    try {
      const offers = await Offer.find({ restaurantId: req.query.restaurantId }).populate({
        path: "food_ids",
        select: "name _id",
      });
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = offerController;
