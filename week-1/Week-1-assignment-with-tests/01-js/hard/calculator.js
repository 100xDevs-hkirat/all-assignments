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
  calculate(expression) {
    // Remove continuous spaces and validate the expression for invalid characters
    const cleanedExpression = expression.replace(/\s+/g, "");
    const invalidCharactersRegex = /[^+\-*/()\d.]/g;
    if (invalidCharactersRegex.test(cleanedExpression)) {
      throw new Error("Invalid characters in the expression");
    }

    // Check for balanced parentheses
    const stack = [];
    for (const char of cleanedExpression) {
      if (char === "(") {
        stack.push(char);
      } else if (char === ")") {
        if (stack.length === 0) {
          throw new Error("Unbalanced parentheses in the expression");
        }
        stack.pop();
      }
    }
    if (stack.length > 0) {
      throw new Error("Unbalanced parentheses in the expression");
    }

    try {
       this.result = eval(cleanedExpression);
      if (typeof this.result !== "number" || !isFinite(this.result)) {
        throw new Error("Invalid arithmetic operation");
      }
      return this.result;
    } catch (error) {
      throw new Error("Invalid expression");
    }
  }

  getResult() {
    return this.result;
  }

  add(num) {
    this.result += num;
  }
  subtract(num) {
    this.result -= num;
  }
  multiply(num) {
    this.result *= num;
  }
  divide(num) {
    if (num === 0) {
      throw new Error("Cannot divide by zero");
    }
    this.result /= num;
  }
  clear() {
    this.result = 0;
  }
}

module.exports = Calculator;
