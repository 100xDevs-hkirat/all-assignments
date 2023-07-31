function test(callback) {
  if (typeof callback === "function") callback();
}

test(() => {
  console.log("Hello World");
});
