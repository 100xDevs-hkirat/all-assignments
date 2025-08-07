const jwt = require("jsonwebtoken");
const jwtKey = "C@nBi-WWKTVZywQ4QNv.";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, jwtKey);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
