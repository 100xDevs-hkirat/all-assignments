const jwt = require("jsonwebtoken");
const jwtKey = "C@nBi-WWKTVZywQ4QNv.";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ error: "Access Denied" });
  try {
    const decoded = jwt.verify(token, jwtKey);
    req._id = decoded._id;
    next();
  } catch (error) {
    return res.status(401).send({});
  }
};

module.exports = verifyToken;
