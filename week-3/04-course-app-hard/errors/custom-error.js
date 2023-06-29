class CustomError extends Error {
  errMsg = "";
  statusCode = 500;
  constructor(msg) {
    super(msg);
    this.errMsg = msg;
    this.statusCode = 500;
  }

  serializeErrors() {
    return { errors: [{ message: this.errMsg }] };
  }
}

module.exports = CustomError;
