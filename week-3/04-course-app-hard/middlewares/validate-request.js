const { validationResult } = require("express-validator");
const RequestValidatonError = require("../errors/request-validation-error");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.errors.length > 0) {
    throw new RequestValidatonError(errors.array());
  }

  next();
};

module.exports = validateRequest;
