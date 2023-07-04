const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, message, res) => {
  const token = signToken(user._id);

  // Remove password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: user,
  });
};

exports.signup = async (req, res) => {
  const { email, password, ...rest } = req.body;
  try {
    const newUser = await User.create({ email, password, ...rest });
    createSendToken(newUser, 201, `${email} signed up successfully`, res);
  } catch (error) {
    console.error('Error signing up:', error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// will not allow user to add other properties such as 'role'
exports.userSignup = (req, res, next) => {
  req.body = { email: req.body.email, password: req.body.password };
  next();
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(404).send('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).send('Incorrect email or password');
    }

    createSendToken(user, 200, `${email} login successful`, res);
  } catch (error) {
    console.error('Error logging in:', error.message);
    return res.status(500);
  }
};

exports.protect = (req, res, next) => {
  // 1) Getting token and check if it's there
  const authHeader = req.headers['authorization'];
  let token;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .send('You are not logged in! Please log in to get access');
  }

  // 2) Verification token and grant access
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send('Invalid Token'); // Forbidden
    }

    try {
      const freshUser = await User.findById(user.id);
      req.user = freshUser;
      next();
    } catch (error) {
      return res.sendStatus(500);
    }
  });
};

exports.adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Only admin can make changes');
  }
  next();
};
