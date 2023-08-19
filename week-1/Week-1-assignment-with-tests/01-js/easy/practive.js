// functions as arguments

function add(i1, i2) {
    return i1 + i2;
  }
  function sub(i1, i2) {
    return i1 - i2;
  }
  function mul(i1, i2) {
    return i1 * i2;
  }
  function div(i1, i2) {
    return i1 / i2;
  }
  
  function sumF(i1, i2, yes) {
    return yes(i1, i2);
  }
  
  let result = sumF(10, 2, mul);
  console.log(result);
  
  // patternCreatingfunction
  
  function createPattern(number) {
    let star = " ";
    for (let i = 0; i < number; i++) {
      star += "*";
      console.log(star)
    }
  }
  
  createPattern(5);
  
  // async nature and file content access
  
  let fs = require('fs')
  
  function addAsync(number) {
    let sum = 0;
    for (let i = 0; i < number; i++) {
      sum += i;
    }
    console.log(sum)
  }
  
  function readFile(err, fileContent) {
    if (err) {
      console.log(err)
    }
  
    addAsync(fileContent)
  }
  
  fs.readFile("hi.txt", "utf8", readFile)
  
  addAsync(100)
  
  // 3. hollow square pattern 
  
  console.log("HollowSqaurePattern : \n ");
  
  function singleRow(number) {
    let str = ' ';
    for (let i = 0; i < number; i++) {
      str += "*"
    }
    console.log(str);
  }
  
  function middleRow(number) {
    let str = ' ';
    for (let i = 0; i < number; i++) {
      if (i == 0 || i == number - 1) {
        str += "*"
      } else {
        str += " "
      }
    }
    console.log(str);
  }
  
  function hollowPattern(number) {
    singleRow(number);
    for (let i = 0; i < number - 2; i++) {
      middleRow(number);
    }
    singleRow(number);
  }
  
  hollowPattern(10);
  
  // 4. Right Triangle Pattern
  
  function rightTriangle(n) {
    let star = "";
  
    for (let i = 0; i < n; i++) {
      let space = " ";
      for (let j = 0; j < n - i; j++) {
        space += " ";
      }
      star += "*";
      console.log(space + star)
    }
  };
  
  console.log("\nRightTrianglePattern : \n ");
  
  rightTriangle(5)
  
  // 5. Downward Triangle Star Pattern
  
  console.log("\n DownTrianglePattern : \n ");
  
  function downTriangle(n) {
  
    for (let i = 0; i < n; i++) {
      // let space = " ";
      let star = " ";
      for (let j = 0; j < n - i; j++) {
        star += "*";
      }
      // star += "*";
      console.log(star)
    }
  };
  
  downTriangle(5);
  
  // 6. Hollow Triangle Star Pattern
  
  console.log("\n HollowTrianglePattern : \n ");
  
  function hollowTriangle(n) {
    let star = " ";
    for (let i = 1; i <= n; i++) {
      star += "*";
      if (i > 2 && i < n) {
        middleRow(i);
      } else {
        console.log(star)
      }
    }
  }
  
  hollowTriangle(20);
  
  // 7. Javascript Pyramid Pattern
  
  console.log("\n PyramidPattern : \n ");
  
  function pyramid(n) {
    for (let i = 0; i < n; i++) {
      let str = ' ';
      for (let j = 0; j < n - i + 1; j++) {
        str += ' ';
      }
  
      for (let k = 0; k < i * 2 - 1; k++) {
        str += '*';
      }
      console.log(str);
    }
  }
  
  pyramid(5);
  
  // 8. Reversed Pyramid Star Pattern
  
  console.log("\n ReversePyramid : \n ");
  
  function revPyramid(n) {
    for (let i = 0; i < n; i++) {
      let str = '';
      for (let k = 0; k < i + 1; k++) {
        str += ' ';
      }
      for (let j = 0; j < 2 * (n - i) - 1; j++) {
        str += "*";
      }
      console.log(str);
    }
  }
  
  revPyramid(5);
  
  // Note : async tasks run only when the js thread is free ! for example : if I'm running the heavy task on js thread(!async task) the async task is block or halted since the js thread is already pre occupied 
  
  // promises
  
  //  understanding !!!
  
  function a() {
    console.log('A running after 3 seconds');
  }
  
  function promiseFunc(resolve) {
    setTimeout(resolve, 5000);
  }
  
  function promise() {
    let p = new Promise(promiseFunc);
    return p;
  }
  
  let r = promise();
  r.then(a);
  
  // understanding...
  
  let fruits = ['apple', 'banana', 'avacado', 'watermelon'];
  
  function getFruits() {
    console.log('printing fruits : \n');
    setTimeout(() => {
      fruits.map((f) => console.log(f));
    }, 6000);
  }
  
  function addFruits(fruit, callback) {
    setTimeout(() => {
      console.log(fruit + ' added in fruits array');
      fruits.push(fruit);
      callback();
    }, 8000);
  }
  
  addFruits('hailgs', getFruits);
  // getFruits();
  
  // function a(callback) {
  
  //   console.log('a is called');
  //   callback();
  
  // }
  
  // function b() {
  //   setTimeout(()=> {
  //     console.log(' b is called');
  //   }, 4000)
  // }
  
  // a(b);
  
  // objects into arrays
  
  function obj(object) {
    let array = [];
    let keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
      let somethingNew = keys[i];
      array.push({
        category: somethingNew,
        amount: object[somethingNew]
      })
    }
    console.log(array);
  }
  
  let object = { 'name': 'who am i', 'age': 'what is my age' };
  obj(object);