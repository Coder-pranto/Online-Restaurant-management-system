const qrCodeService = require("../services/qrCodeService");
const CustomError = require("../utils/customError");
const QRCode = require('qrcode');

const generateQrCode = async (req, res, next) => {
    try {
        const tableNumber = req.params.tableNumber;
        const { restaurantId, url } = req.body;
        const qrCodeData = `${url}?restaurantId=${restaurantId}&table=${tableNumber}`;

        // generate qr code as a data url
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);

        // save and update qr code to database
        const upsertQrCode = await qrCodeService.updateQrCodeService({ tableNumber, qrCodeDataUrl, restaurantId });
        if (!upsertQrCode.modifiedCount) {
            res.status(201).json({
                status: 'success',
                message: 'QR code successfully created',
                data: upsertQrCode
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'QR code successfully updated',
                data: upsertQrCode
            })
        }

    } catch (error) {
        const err = new CustomError(error.message, 400);
        next(err);
    }
}


module.exports = {
    generateQrCode
}