function test(callback) {
  if (typeof callback === "function") setTimeout(callback, 3000);
}

test(() => {
  console.log("Hello World");
});
