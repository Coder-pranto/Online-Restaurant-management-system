const SuperAdmin = require("../model/superAdminModel")

// super admin login
const getSuperAdminService = async (email) => {
    const result = await SuperAdmin.findOne({ email });
    return result;
}

module.exports = {
    getSuperAdminService
};