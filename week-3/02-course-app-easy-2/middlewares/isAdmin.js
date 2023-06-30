const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    
    if (!token) {
      throw new Error("Not logged in");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      throw new Error("Invalid Token");
    } 
    req.admin = admin;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = isAdmin;
