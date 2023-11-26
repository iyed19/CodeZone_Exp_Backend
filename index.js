require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoose = require('mongoose');

const httpStatusText = require('./utils/HttpStatus');

const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";

async function main(){ 
    await mongoose.connect(url).then(() => {
    console.log("connected to MongoDB");
});
}
main();

app.use(cors());
app.use(express.json());

const coursesRouter = require('./router/courses-router');
const usersRouter = require('./router/users-router');

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

// Global middleWare for not found routers
app.all('*',(req, res, next) => {
    return res.status(404).json({status: httpStatusText.ERROR, message: "This resource is not available!"});
});

// Global error handler
app.use((error, req, res , next) => {
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message});
})

app.listen(process.env.PORT || 5600, () => {
    console.log("Server is running on port 5600");
});