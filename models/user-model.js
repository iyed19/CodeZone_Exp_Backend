const mongoose = require('mongoose');
const validator = require('validator');
const userRole = require('../utils/roles');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator.isEmail, "field required a valid email adresse"]
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRole.USER, userRole.ADMIN, userRole.MANAGER],
        default: userRole.USER
    },
    avatar: {
        type: String,
        default: '../uploads/profile.png'
    }
})

module.exports = mongoose.model('User', userSchema);