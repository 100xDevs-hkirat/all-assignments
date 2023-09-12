const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const adminSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.create({ username, password });
    res.status(201).json({ message: 'Admin created successfully' });  
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.headers;
    if (!username || !password) {
      throw new Error("Please provide username and password");
    }
    
    const admin = await Admin.findOne({ username }).select("+password");
    const invalidCredentialsMsg = "Invalid username or password";
    if (!admin) throw new Error(invalidCredentialsMsg);
    
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) throw new Error(invalidCredentialsMsg);
    const jwtsecret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ id: admin._id }, jwtsecret, { expiresIn: "1h" });
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  adminLogin,
  adminSignup,
};
