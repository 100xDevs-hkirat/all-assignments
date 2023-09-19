const express = require('express');

const userController = require('../controllers/userController');
const verifyToken = require('../utils/verifyToken');
const router = express.Router();

router.post("/signup",userController.createUser);

router.post("/login",userController.loginUser);

router.get("/courses",verifyToken,userController.getUserCourses);

router.post("/courses/:courseId",verifyToken,userController.purchaseCourse);

router.get("/purchasedCourses",verifyToken, userController.getPurchasedCourses);

module.exports = router;