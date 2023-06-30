module.exports.verifyToken =  (req,res,next) => {
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