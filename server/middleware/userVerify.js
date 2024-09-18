const jwt = require("jsonwebtoken");
const { secret_key } = require("../config");
const CustomError = require("../utils/customError");


const verifyJWTToken = (...requiredRoles) => {
  return async (req, res, next) => {
    const isCustomer = requiredRoles.includes('customer')
    const token = req.headers.authorization;
    if (isCustomer && !token) {
      next();
    } else {
      if (!token) {
        return next(new CustomError('unauthorized access', 401))
      }

      jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err);
          return next(new CustomError('unauthorized access', 401))
        }

        req.decoded = decoded;
        console.log(decoded)

        if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
          return next(new CustomError('Forbidden', 403))
        }
        next();
      });
    };

  }


};

module.exports = verifyJWTToken;
