const express = require('express');
const jwt = require('jsonwebtoken');
const adminController = require('../controllers/adminController');
const secretKey = "siriusblackinwater"

const router = express.Router();
const verifyToken = (req,res,next) => {
    const auth = req.headers.authorization;

    if( !auth || !auth.startsWith("Bearer")){
        return res.status(401).json({message: "Please provide a token"})
    }
    const token = auth.split(' ')[1];

    jwt.verify(token,secretKey,(err, decoded ) => {
        if(err) {
            return res.status(403).json({messge: "invalide token"})
        }
        req.user = decoded;
            next();
    })
}
router.post('/signup',adminController.createAdmin);

router.post("/login",adminController.loginAdmin);

router.post("/courses",verifyToken,adminController.createCourse);

router.put("/courses/:courseId",verifyToken,adminController.updateCourse);

router.get("/courses",adminController.getCourses);


module.exports = router;

