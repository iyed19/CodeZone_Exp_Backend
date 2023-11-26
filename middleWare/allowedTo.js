const appError = require('../utils/appError');

module.exports = (...roles) => {
    // ... these 3 pts make the parameters as array
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)){
            return next(appError.create('This role is not Authorized!', 401));
        }
        next();
    }
}