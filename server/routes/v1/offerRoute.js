const express = require("express");
const offerController = require("../../controllers/offerController");
const imageUpload = require("../../middleware/imageUpload");
const { checkJwt } = require("../../middleware/userVerify");
const verifyJWTToken = require("../../middleware/userVerify");
const router = express.Router();

router.post(
  "/",
  verifyJWTToken('restaurant_admin'),
  imageUpload.single("offer_image"),
  offerController.createOffer
);
// router.get("/", offerController.listFoods);
router.get("/", verifyJWTToken('restaurant_admin', 'customer'), offerController.listOffer);

//Update a Food
router.patch(
  "/:id",
  verifyJWTToken('restaurant_admin'),
  imageUpload.single("offer_image"),
  offerController.updateOffer
);
//Delete a Food
router.delete("/:id", verifyJWTToken('restaurant_admin'), offerController.deleteOffer);

module.exports = router;
