// As part of the Assignment question which was asked on the YT channel on 17th Nov 2023

// Create a swap function that can takes two args of the same type
// Args can be either two string, number or boolean(both of the same type)
// The function should swap them and return an array with first element as the second one and vice versa

function swap<T>(input1:T, input2:T) {
    return [input2, input1];
}

let stringExample = swap<string>("Hello", "World");
let numberExample = swap<number>(1, 2);
let booleanExample = swap<boolean>(true, false);

console.log(stringExample); // ["World", "Hello"]
console.log(numberExample); // [2,1]
console.log(booleanExample); // [false, true]
