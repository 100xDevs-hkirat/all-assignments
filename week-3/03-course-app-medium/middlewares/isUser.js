const User = require("../models/user.model");

const isUser = async (req, res, next) => {
  try {
    const { username, password } = req.headers;
    if (!username || !password) {
      throw new Error("Please provide username and password in headers");
    }

    const user = await User.findOne({ username }).select("+password");
    const invalidCredentialsMsg = "Invalid username or password";
    
    if (!user) throw new Error(invalidCredentialsMsg);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error(invalidCredentialsMsg);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = isUser;
