const {validationResult} = require('express-validator');
const Course = require('../models/course-model');
const httpStatusText = require('../utils/HttpStatus');
const asyncWrapper = require('../middleWare/asyncWrapper');
const appError = require('../utils/appError');

const getAllCourses = asyncWrapper(
        async (req, res) => {
            const query = req.query;
            const limit = query.limit || 3;
            const page = query.page || 1;
            const skip = (page-1) * limit;
            const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);
            res.json({status: httpStatusText.SUCCESS, data: {courses}});
    }
)

const getCourse = asyncWrapper(
    async (req, res, next) => {
            const course = await Course.findById(req.params.courseId);
            if(!course){
                const error = appError.create('Course not Found!', 404, httpStatusText.FAIL);
                return next(error);
                //return res.status(404).json({status: httpStatusText.FAIL, data: {course: "Course not Found!"}});
            }
            return res.json({status: httpStatusText.SUCCESS, data: {course}});
    }
)

const addCourse = asyncWrapper(
    async (req, res) =>{          
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
            //return res.status(400).json({status: httpStatusText.FAIL, data: errors.array()});
        }

        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});
}
)

const updateCourse = asyncWrapper(
    async (req, res) => {
        const updatedCourse = await Course.updateOne({_id: req.params.courseId}, {$set: {... req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data: {course: updatedCourse}});
        //return res.status(400).json({status: httpStatusText.ERROR, message: err.message});
    }
)

const deleteCourse = asyncWrapper(
    async (req, res) => {
        const deletedCourse = await Course.deleteOne({_id: req.params.courseId});
        return res.status(200).json({status: httpStatusText.SUCCESS, data: null});
        //return res.status(400).json({status: httpStatusText.ERROR, message: err.message});
    }
)

module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
}