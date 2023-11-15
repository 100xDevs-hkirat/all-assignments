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
    this.result = 0
  }

  add(num) {
    this.result += num
  }
  subtract(num) {
    this.result -= num
  }
  multiply(num) {
    this.result *= num
  }
  divide(num) {
    try {
      if (num === 0) throw new Error('Dividing by 0 is not valid')
      this.result = parseFloat((this.result / num).toFixed(6))
    } catch (error) {
      console.log(`Error: ${error.message}`)
    }
  }
  clear() {
    this.result = 0
  }
  getResult() {
    return this.result
  }
  calculate(str) {
    try {
      str = str.replace(/\s/g, '')
      if (/[a-zA-Z]/.test(str))
        throw new Error('Expression contains invalid characters')
      if (str.includes('/0')) throw new Error('Dividing by 0 is not valid')
      this.result = eval(str)
    } catch (error) {
      console.log(`Error: ${error.message}`)
    }
  }
}

let calc = new Calculator()

calc.calculate('10 / 0')
console.log(calc.getResult())
module.exports = Calculator
