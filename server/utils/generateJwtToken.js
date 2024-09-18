const jwt = require('jsonwebtoken');
const { secret_key } = require("../config");

const generateJwtToken = (payload) => {
    const token = jwt.sign(payload, secret_key, {expiresIn: '1d'});
    return token;
}

module.exports = generateJwtToken;