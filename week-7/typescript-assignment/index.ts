type Pair<T> = [T, T];

function swapPair<T>(a: T, b: T): Pair<T> {
  return [b, a];
}

const output1: Pair<number> = swapPair(1, 2);
const output2: Pair<boolean> = swapPair(true, false);
const output3: Pair<string> = swapPair("c", "a");
const output4: Pair<string> = swapPair("c", 1); // error since mismatch types

console.log(output4);
