const CustomError = require("../errors/custom-error");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeErrors());
  }

  return res
    .status(500)
    .json({ errors: [{ message: "Something went wrong!!" }] });
};

module.exports = errorHandler;
