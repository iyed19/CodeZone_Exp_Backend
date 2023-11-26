const express = require('express');

const router = express.Router();

const usersController = require('../controller/users-controller');
const verifyToken = require('../middleWare/verifyToken');
const userRole = require('../utils/roles');
const allowedTo = require('../middleWare/allowedTo');
const multer = require('multer');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads');
    },
    filename: function (req, file, cb){
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType == "image"){
        return cb(null, true);
    }else{
        return cb(appError.create("The file must be an image",400), false);
    }
}

const upload = multer({
    storage: diskStorage, 
    fileFilter
});

// Get all users

// Register

// LogIn


router.route('/')
            .get(verifyToken, allowedTo(userRole.MANAGER), usersController.getAllUsers);
            
router.route('/register')
            .post(upload.single('avatar'), usersController.register);

router.route('/login')
            .post(usersController.login);

module.exports = router;
