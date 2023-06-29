const jwt = require('jsonwebtoken');

module.exports = {
    auth: (req, res, next) => {
        const token = req.headers.authorization.split(' ');
        try {
            var decoded = jwt.verify(token[1], 'secret');
            req.username = decoded.username;
        } catch(err) {
            console.log(err);
            return res.send({message: 'Invalid token', err})
        }
        next()
    }
}