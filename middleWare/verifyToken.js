const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/HttpStatus');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if(!authHeader){
        const error = appError.create('Token is required!', 401, httpStatusText.ERROR);
        return next(error);
    }
    try{
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    }catch(err){
        const error = appError.create('Invalid Token!', 401, httpStatusText.ERROR);
        return next(error);
    }
}
module.exports = verifyToken;