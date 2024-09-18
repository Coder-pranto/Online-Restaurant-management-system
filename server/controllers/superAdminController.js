const { super_admin_token, secret_key } = require("../config");
const superAdminService = require("../services/superAdminService")
const CustomError = require("../utils/customError");
const generateJwtToken = require("../utils/generateJwtToken");


// super admin login
const superAdminLoginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const superAdmin = await superAdminService.getSuperAdminService(email)

        // check password
        if (superAdmin?.password !== password) {
            return next(new CustomError('invalid email or password', 401))
        }

        // create jwt token 
        const payload = {
            email,
            role: 'super_admin'
        }
        const token = generateJwtToken(payload)

        const { password: pwd, ...otherInfoWithoutPass } = superAdmin.toObject();
        otherInfoWithoutPass.token = token;
        res.status(200)
            .json({
                status: 'success',
                message: 'super admin login successfull',
                data: otherInfoWithoutPass
            })

    } catch (error) {
        next(new CustomError(error.message, 400))
    }
}

module.exports = {
    superAdminLoginController
}