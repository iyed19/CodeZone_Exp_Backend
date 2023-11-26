const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const courseController = require('../controller/courses-controller');
const verifyToken = require('../middleWare/verifyToken');
const userRole = require('../utils/roles');
const allowedTo = require('../middleWare/allowedTo');

// CRUD (Create / Read / Update / Delete)

//GET all courses         //GET = from server to client
router.get('/', courseController.getAllCourses);
//GET single course
router.get('/:courseId', courseController.getCourse);

//Create new course         //POST = from client to server
//The way with express-validator middleware
router.post('/',verifyToken , allowedTo(userRole.ADMIN, userRole.MANAGER), 
    body('title').isLength({min: 8})
        .withMessage("Title at least 8 caracters")
        .notEmpty()
        .withMessage("Title is required"),
    body('price')
        .isLength({min: 3})
        .withMessage("Price at least 3 digits")
        .notEmpty()
        .withMessage("Price is required"),
        courseController.addCourse);

//Update the course         //PATCH = from client to server
router.patch('/:courseId',verifyToken , allowedTo(userRole.ADMIN, userRole.MANAGER), courseController.updateCourse);

//Delete a course           
router.delete('/:courseId',verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), courseController.deleteCourse);

module.exports = router;



// app.post('/api/courses', (req, res) =>{       //classic way to add a course in express without express-validator middleware
//     if(!req.body.title){
//         return res.status(400).json({error: 'Title not provided'});
//     }
//     if(!req.body.price){
//         return res.status(400).json({error: 'Price not provided'});
//     }
//     courses.push({id: courses.length+1, ...req.body});
//     res.status(201).json(courses);
// });


//w zada bech te5taser w tekteb code andhef bbrcha : 
/*
    router.route('/')
        .get(courseController.getAllCourses);
        .post( 
            body('title').isLength({min: 8})
                .withMessage("Title at least 8 caracters")
                .notEmpty()
                .withMessage("Title is required"),
            body('price')
                .isLength({min: 3})
                .withMessage("Price at least 3 digits")
                .notEmpty()
                .withMessage("Price is required"),
            courseController.addCourse);

    router.route('/:courseId')
        .get(courseController.getCourse);
        .patch(courseController.updateCourse);       
        .delete(courseController.deleteCourse);

    module.exports = router;
*/