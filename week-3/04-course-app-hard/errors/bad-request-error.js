const CustomError = require("./custom-error");

class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(msg) {
    super(msg);
    this.errMsg = msg;
  }

  serializeErrors() {
    return { errors: [{ message: this.errMsg }] };
  }
}

module.exports = BadRequestError;
