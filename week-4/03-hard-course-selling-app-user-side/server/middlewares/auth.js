const jwt = require("jsonwebtoken");
const SECRET = "MyLittleSecret";

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, decrypted) => {
      if (err) {
        return res.sendStatus(203);
      }
      req.user = decrypted;
      // res.json({ message : "Decrypted Succesfully !! : ", decrypted });
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const generateJwt = (jwtObj) => {
  const token = jwt.sign(jwtObj, SECRET, { expiresIn: "1h" });
  return token;
};

module.exports = {
  authenticateJwt,
  generateJwt,
  SECRET,
};
