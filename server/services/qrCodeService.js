const QrCodeInfo = require("../model/qrCodeInfoModel")

const updateQrCodeService = async (qrCodeData) => {
    const qrCode = await QrCodeInfo.updateOne({ tableNumber: qrCodeData.tableNumber }, qrCodeData, {
        runValidators: true,
        upsert: true
    })
    if (qrCode.acknowledged) {
        const getQRCodeData = await QrCodeInfo.findOne({ tableNumber: qrCodeData.tableNumber });
        return getQRCodeData;
    }
    return null;
}

module.exports = {
    updateQrCodeService
}