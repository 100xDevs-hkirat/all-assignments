let count = 0;

async function CountUp() {
  for (let i = 0; i < 10; i++) {
    count += 1;
    console.clear();
    console.log(count);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

CountUp();
