const CustomError = require("./custom-error");

class AuthRequestError extends CustomError {
  statusCode = 403;
  constructor(msg) {
    super(msg);
    this.errMsg = msg;
  }

  serializeErrors() {
    return { errors: [{ message: this.errMsg }] };
  }
}

module.exports = BadRequestError;
