const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.post("/signup",userController.createUser);

router.post("/login",userController.loginUser);

router.get("/courses",userController.getUserCourses);

router.post("/courses/:courseId",userController.purchaseCourse);

router.get("/purchasedCourses",userController.getPurchasedCourses);

module.exports = router;