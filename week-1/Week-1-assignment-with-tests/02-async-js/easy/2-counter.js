let counter = 0;

const traditionalTimer = () => {
  const prom = new Promise((resolve) =>
    setTimeout(() => {
      counter++;
      console.log(counter);
      resolve();
    }, 1000)
  );

  prom.then(traditionalTimer);
};

const asyncTimer = async () => {
  while (true) {
    const prom = new Promise((resolve) =>
      setTimeout(() => {
        counter++;
        console.log(counter);
        resolve();
      }, 1000)
    );

    await prom;
  }
};

//traditionalTimer();
asyncTimer();
