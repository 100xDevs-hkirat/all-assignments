function arrayMapWithCallback(arr, callback) {
  const newArr = arr.map(callback);
  console.log(newArr);
}

arrayMapWithCallback([2, 3, 5], (n) => {
  return 2 * n;
});
