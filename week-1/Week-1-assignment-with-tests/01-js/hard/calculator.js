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

  add = (num) => (this.result += num);
  subtract = (num) => (this.result -= num);
  multiply = (num) => (this.result *= num);
  divide = (num) => {
    if (num === 0) throw Error("input can't be zero");
    this.result /= num;
  };
  clear = () => (this.result = 0);
  getResult = () => this.result;
  calculate = (input) => {
    const tokens = tokensFromInput(input);
    const postfixTokens = convertToPostfix(tokens);

    const resultStack = [];
    postfixTokens.forEach((token) => {
      if (isOperator(token)) {
        const b = resultStack.pop();
        const a = resultStack.pop();
        const res = operation(a, b, token);

        resultStack.push(res);
      } else {
        resultStack.push(token);
      }
    });

    if (resultStack.length !== 1) throw Error("Invalid Input");
    this.result = resultStack.pop();
  };
}

const operation = (num1, num2, operator) => {
  let a = parseFloat(num1);
  let b = parseFloat(num2);

  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b == 0) throw Error("cant divide by zero");
      return a / b;
  }
};

const precedenceOf = (c) => {
  if (c === "+" || c === "-") return 1;
  else if (c === "*" || c === "/") return 2;
  else return 0;
};

const isOperator = (c) => {
  if (
    c === "+" ||
    c === "-" ||
    c === "*" ||
    c === "/" ||
    c === "(" ||
    c === ")"
  )
    return true;
  return false;
};

const tokensFromInput = (input) => {
  const tokens = [];
  let tokenChars = [];
  const exp = input.replace(/\s/g, "");
  for (let index = 0; index < exp.length; index++) {
    const c = exp[index];

    if (c >= "0" && c <= "9") tokenChars.push(c);
    else if (isOperator(c)) {
      if (tokenChars.length !== 0) {
        tokens.push(tokenChars.join(""));
        tokenChars.length = 0;
      }
      tokens.push(c);
    } else if (c === ".") tokenChars.push(c);
    else {
      throw Error("Invalid Input");
    }
  }
  if (tokenChars.length) tokens.push(tokenChars.join(""));
  return tokens;
};

const convertToPostfix = (tokens) => {
  const operators = [];
  const postFix = [];

  tokens.forEach((token) => {
    if (token === ")") {
      let top = operators.pop();
      while (top !== "(") {
        if (!top) throw Error("Not a valid input");
        postFix.push(top);
        top = operators.pop();
      }
    } else if (token === "(") operators.push(token);
    else if (isOperator(token)) {
      while (operators.length) {
        const top = operators[operators.length - 1];
        if (precedenceOf(top) >= precedenceOf(token)) {
          operators.pop();
          postFix.push(top);
        } else break;
      }
      operators.push(token);
    } else postFix.push(token);
  });

  let top = operators.pop();
  while (top) {
    if (top === "(") throw Error("Not a valid Input");
    postFix.push(top);
    top = operators.pop();
  }

  return postFix;
};

module.exports = Calculator;
