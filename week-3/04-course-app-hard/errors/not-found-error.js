const CustomError = require("./custom-error");

class NotFoundError extends CustomError {
  statusCode = 404;
  msg = "Route not found";
  constructor(msg) {
    super(msg);
  }

  serializeErrors() {
    return { errors: [{ message: this.msg }] };
  }
}

module.exports = NotFoundError;
