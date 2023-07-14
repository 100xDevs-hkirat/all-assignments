/*
Array Map with Callback:
Implement a function 'mapArray' that takes an array and a callback function 
as arguments. 'mapArray' should apply the callback function to each element 
of the array and return a new array with the modified values.
*/

const mapArray = (array, callbackFn) => {
  const newArray = [];

  for (item of array) {
    const modifiedItem = callbackFn(item);

    newArray.push(modifiedItem);
  }

  return newArray;
};

const array = [3, 5, 10];

const arr1 = array.map((x) => x * 2);

const arr2 = mapArray(array, (x) => x * 2);

console.log(arr1);
console.log(arr2);
