const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token Authorization denied" });

  try {
    jwt.verify(token, config.get("jwtSecret"), (err, decoded) => {
      if (err) return res.status(401).json({ msg: "Invalid token" });
      req.user = decoded.user;
      next();
    });
  } catch (err) {
    console.error("Something is wrong with jwt");
    if(err) return res.status(500).json({msg : "Server Error"})
  }
};
