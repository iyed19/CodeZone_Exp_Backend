const asyncWrapper = require('../middleWare/asyncWrapper');
const User = require('../models/user-model');
const httpStatusText = require('../utils/HttpStatus');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/generate-JWT');


const getAllUsers = asyncWrapper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit || 3;
        const page = query.page || 1;
        const skip = (page-1) * limit;
        const users = await User.find({}, {"__v": false, 'password': false}).limit(limit).skip(skip);
        res.json({status: httpStatusText.SUCCESS, data: {users}});
}
)

const register = asyncWrapper(
    async(req, res, next) => {
        const {firstName, lastName, email, password, role} = req.body;

        const existedUser = await User.findOne({email: email});
        if(existedUser){
            const error = appError.create('User already Exists!', 400, httpStatusText.FAIL);
            return next(error);
        }

        //password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar: req.file.filename
        });

        //generate JWT token
        const generatedToken = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
        newUser.token = generatedToken;

        await newUser.save();
        res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser}});
    }
)

const login = asyncWrapper(
    async(req, res, next) => {
        const {email, password} = req.body;
        if(!email && !password){
            const error = appError.create('Email & Password are required!', 400, httpStatusText.FAIL);
            return next(error);
        }

        const user = await User.findOne({email: email});
        if(!user){
            const error = appError.create('User not Found!', 400, httpStatusText.FAIL);
            return next(error);
        }
        
        const matchedPassword = await bcrypt.compare(password, user.password);
        if(user && matchedPassword){
            const generatedToken = await generateJWT({email: user.email, id: user._id, role: user.role});
            return res.status(200).json({status: httpStatusText.SUCCESS, data: {user: "LogedIn successfully", token: generatedToken}});
        }else if(user && !matchedPassword){
            const error = appError.create('Password Incorrect!', 500, httpStatusText.FAIL);
            return next(error);
        }else{
            const error = appError.create('Something Wrong!', 500, httpStatusText.FAIL);
            return next(error);
        }
    }
)

module.exports = {
    getAllUsers,
    register,
    login
}