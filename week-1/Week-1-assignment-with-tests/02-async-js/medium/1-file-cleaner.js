const fs = require('fs');

const fileCleaner = (str) => {
  const arr = str.split(' ').filter((el, i) => el !== '');
  const output = arr.join(' ').trim();
  return output;
};

async function readAndWrite() {
  try {
    const data = await fs.promises.readFile('./spaces.txt', 'utf-8');
    const cleanData = fileCleaner(data);

    fs.promises
      .writeFile('./clean.txt', cleanData)
      .then(() => {
        console.log('File has been written successfully!');
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (error) {
    console.log(error);
  }
}

readAndWrite();
