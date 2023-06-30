const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const isUser = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Not logged in");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("Invalid Token");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = isUser;
