const jwt = require('jsonwebtoken');
const dev = require('../config/index');
const HttpError = require('../models/http-error');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('No token found...');
        }
        const tokenDecoded = jwt.verify(token, dev.app.jwtSecretKey);
        req.userData = { userId: tokenDecoded.userId};
        next();
    }catch(err){
        return next(new HttpError('Authentication Failed...', 422))
    }
}