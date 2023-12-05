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
  constructor(){
    this.result=0;
  }
  addition(num){
    this.result+=num;
  }
  subtraction(num){
    this.result-=num;
  }
  multiply(num){
    this.result*=num;
  }
  divide(num){
    if(num===0){
      console.log("Can't divide a number with zero!");
    
    }
    this.result/=num;
  }
  clear(){
    this.result=0;
  }
  getResult(){
    return this.result;
  }
  calculate(expression){
    const sanitizedExpression=expression.replace(/\s+/g,' ');
    const numericRegex=/^[+-]?\d+(\.\d+)?$/;

    const token=[];
    let currentToken='';

    for(let char of sanitizedExpression){
      if(char.match(/[0-9.]|\+|\-|\*|\//)){
        currentToken+=char;
      }
      else{
        if(currentToken){
          if(!currentToken.match(numericRegex)){
            throw new Error('Invalid input:Non numerical value detected');
          }
          tokens.push(Number(currentToken));
          currentToken='';
        }

        if(char!==''){
          tokens.push(char);
        }
      }
    }

    if(currentToken){
      if(!currentToken.match(numericRegex)){
        throw new Error('Invalid input:Non-numerical value detected');
      }
      token.push(Number(currentToken))
    }

    const stack=[];
    let operator='+';

    for(let token of tokens){
      if(typeof token==='number'){
        if(operator==='+'){
          this.addition(token);
        }else if(operator==='-'){
          this.subtraction(token);
        }else if(operator==='*'){
          this.multiply(token);
        }else if(operator==='/'){
          this.divide(token);
        }


      }else if(['+','-','*','/'].includes(token)){
        operator=token;
      }
      
    }

    return this.result;
    
  }

}

module.exports = Calculator;
