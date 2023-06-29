const jwt = require('jsonwebtoken');

module.exports = {
    auth: (req, res, next) => {
        // invalid token - synchronous
        const token = req.headers.authorization.split(' ');
        // console.log(token);
        try {
            var decoded = jwt.verify(token[1], 'secret');
            req.username = decoded.username;
            // console.log(decoded)
        } catch(err) {
            // err
            console.log(err);
            return res.send({message: 'Invalid token', err})
        }
        next()
    }
}