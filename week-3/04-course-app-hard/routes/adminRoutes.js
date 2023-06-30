const express = require('express');
const jwt = require('jsonwebtoken');
const adminController = require('../controllers/adminController');
const secretKey = "siriusblackinwater"

const router = express.Router();
const verifyToken = require('../utils/verifyToken');

router.post('/signup',adminController.createAdmin);

router.post("/login",adminController.loginAdmin);

router.post("/courses",verifyToken,adminController.createCourse);

router.put("/courses/:courseId",verifyToken,adminController.updateCourse);

router.get("/courses",adminController.getCourses);


module.exports = router;

