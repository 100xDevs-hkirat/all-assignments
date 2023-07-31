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
    this.allowed = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "+",
      "-",
      "/",
      "*",
    ];
  }

  add(n) {
    this.result += n;
    console.log(this.result);
  }

  subtract(n) {
    this.result -= n;
    console.log(this.result);
  }

  multiply(n) {
    this.result *= n;
    console.log(this.result);
  }

  divide(n) {
    if (n === 0) throw new Error("can't divide by zero");
    this.result /= n;
    console.log(this.result);
  }

  clear() {
    this.result = 0;
    console.log(this.result);
  }

  getResult() {
    console.log(this.result);
    return this.result;
  }

  calculate(str) {
    str = str.split("");
    let tmp = [];
    str.forEach((chr, i) => {
      if (this.allowed.includes(chr)) tmp.push(chr);
    });
    str = tmp.join("");
    this.result = eval(str);
    console.log(this.result, str);
  }
}

const calci = new Calculator();
calci.add(3);
calci.subtract(1);
calci.multiply(10);
calci.divide(2);
calci.clear();
calci.getResult();

calci.calculate(`10+ab7`);
calci.calculate(`10+ab -9 cc 7`);
calci.calculate(`a+9-c+6`);
module.exports = Calculator;
