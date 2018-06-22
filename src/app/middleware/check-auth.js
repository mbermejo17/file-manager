const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const JWT_KEY = config.jwtKey;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log('Token:',token);
        const decoded = jwt.verify(token.trim(), JWT_KEY);
        console.log('Token Decoded:',decoded);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};