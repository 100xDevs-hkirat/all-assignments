const jwt = require('jsonwebtoken')
require('dotenv').config();

const authenticateJwtAdmin = (req,res,next) => {
    const accessToken = req.header("token");
    if(accessToken) {
        const token = accessToken.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN, (err,user) => {
        if(err) {
            res.status(403).send("Got Authenticatoin Error");
        }
        req.user = user;
        next();
        })
    }
    else {
        res.status(401).send("Provide JWT token");
    }
}
  
const authenticateJwtUser = (req,res,next) => {
    const accessToken = req.header("token");
    if(accessToken) {
        const token = accessToken.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY_USER, (err,user) => {
        if(err) {
            res.status(403).send("Got Authentication Error");
        }
        else {  
            req.user = user;
            next();
        }
        })
    }
    else {
        res.status(401).send("Provice JWT token");
    }
}

module.exports = {
    authenticateJwtAdmin,
    authenticateJwtUser
}

