const CustomError = require("./custom-error");

class RequestValidatonError extends CustomError {
  statusCode = 400;
  constructor(errors) {
    super("");
    this.errors = errors;
  }

  serializeErrors() {
    let err = this.errors.map((err) => {
      let errObj = { message: err.msg };
      if (err.path) {
        errObj.field = err.path;
      }

      return errObj;
    });

    return { errors: err };
  }
}

module.exports = RequestValidatonError;
