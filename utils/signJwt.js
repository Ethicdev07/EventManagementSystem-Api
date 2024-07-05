const jwt = require('jsonwebtoken');

const signJwt = (id) => {
    return jwt.sign({ id }, process.env.JwtSecret, {
        expiresIn: process.env.jwtExpiresIn,
    });
};

module.exports = signJwt