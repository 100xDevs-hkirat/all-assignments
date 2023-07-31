function arrayFilterWithCallback(arr, callback) {
  const newArr = arr.filter(callback);
  console.log(newArr);
}

arrayFilterWithCallback([1, 2, 4, 6, 7, 9], (n) => {
  return n % 2 === 0;
});
