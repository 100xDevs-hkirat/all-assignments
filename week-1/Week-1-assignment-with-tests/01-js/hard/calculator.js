/*
  Implement a class `Calculator` having below methods
    - initialise a result variable in the constructor and keep updating it after every arithmetic operation
    - add: takes a number and adds it to the result
    - subtract: takes a number and subtracts it from the result
    - multiply: takes a number and multiply it to the result
    - divide: takes a number and divide it to the result
    - clear: makes the `result` variable to 0
    - getResult: returns the value of `result` variable
    - calculate: takes a string expression which can take multi-arithmetic operations and give its result
      example input: `10 +   2 *    (   6 - (4 + 1) / 2) + 7`
      Points to Note: 
        1. the input can have multiple continuous spaces, you're supposed to avoid them and parse the expression correctly
        2. the input can have invalid non-numerical characters like `5 + abc`, you're supposed to throw error for such inputs

  Once you've implemented the logic, test your code by running
  - `npm run test-calculator`
*/

class Calculator {
  constructor() {
    this.result = 0;
  }
  add(n) {
    this.result += n;
  }
  subtract(n) {
    this.result -= n;
  }

  multiply(n) {
    this.result *= n;
  }

  divide(n) {
    if (n == 0) {
      throw new Error();
    }
    this.result /= n;
  }

  clear(n) {
    this.result = 0;
  }

  getResult(n) {
    return this.result;
  }

  calculate(str) {
    var newStr = str.replace(/\s+/g, "");
    if (/^[\d()+\-*/.]+$/.test(newStr) == false) {
      throw new Error("Error detected");
    }
    if (newStr.includes("/0")) {
      throw new Error("Division by zero is not allowed");
    } else {
      var par = eval(newStr);
      this.result = par;
    }

    return this.result;
  }
}

module.exports = Calculator;
