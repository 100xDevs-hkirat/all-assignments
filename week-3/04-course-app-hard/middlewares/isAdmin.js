const Admin = require("../models/admin.model");

const isAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.headers;
    if (!username || !password) {
      throw new Error("Please provide username and password in headers");
    }

    const admin = await Admin.findOne({ username }).select("+password");
    const invalidCredentialsMsg = "Invalid username or password";
    
    if (!admin) throw new Error(invalidCredentialsMsg);

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) throw new Error(invalidCredentialsMsg);

    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = isAdmin;
