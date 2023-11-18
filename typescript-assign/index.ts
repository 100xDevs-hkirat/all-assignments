// function used to swap elements 

function doSwap<T>(a: T, b: T): T[] {
  return [b, a];
};

const output1 = doSwap(5, 10);
const output2 = doSwap(true, false);
const output3 = doSwap('c', 'a');
console.log(output3)