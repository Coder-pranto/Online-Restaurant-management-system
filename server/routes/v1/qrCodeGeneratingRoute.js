const express = require('express');
const qrCodeController = require('../../controllers/qrCodeGeneratingController');
const verifyJWTToken = require('../../middleware/userVerify');

const qrCodeGeneratingRouter = express.Router();

qrCodeGeneratingRouter.post('/:tableNumber', verifyJWTToken('restaurant_admin'), qrCodeController.generateQrCode)

module.exports = qrCodeGeneratingRouter;