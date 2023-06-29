const jwt = require("jsonwebtoken");
const AuthRequestError = require("../errors/bad-request-error");
const User = require("../models/user");
const Admin = require("../models/admin");

const authorise = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    console.log("No a auth header");
    throw new AuthRequestError("User needs to be authorized");
  }

  const token = authHeader.split("Bearer ")[1];
  if (!authHeader) {
    console.log("Improper header format");
    throw new AuthRequestError("User needs to be authorized");
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!tokenData.userId || !tokenData.time) {
      throw new AuthRequestError("Improper token found");
    }
    req.userId = tokenData.userId;
    req.time = tokenData.time;
  } catch (err) {
    throw new AuthRequestError(err.message);
  }

  next();
};

const authenticate = async (req, res, next) => {
  const user = await User.findById(req.userId).exec();

  if (!user) {
    throw new AuthRequestError("Unauthorized, user does not exist");
  }

  if (!hasTTL(req.time)) {
    throw new AuthRequestError(
      "Your token has expired. Please login again to get a new one"
    );
  }

  next();
};

const authenticateAdmin = async (req, res, next) => {
  const user = await Admin.findById(req.userId).exec();

  if (!user) {
    throw new AuthRequestError("Unauthorized, user does not exist");
  }

  if (!hasTTL(req.time)) {
    throw new AuthRequestError(
      "Your token has expired. Please login again to get a new one"
    );
  }

  next();
};

const hasTTL = (time) => {
  const now = new Date();
  const timeDiff = (now - new Date(time)) / (1000 * 60);

  if (timeDiff > 60) {
    return false;
  }

  return true;
};

module.exports = { authorise, authenticate, authenticateAdmin };
