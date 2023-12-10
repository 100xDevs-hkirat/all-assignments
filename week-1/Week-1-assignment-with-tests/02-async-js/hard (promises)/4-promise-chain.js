/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */


function waitOneSecond() {
    return new Promise((res, rej) => {
  
      setTimeout(() => {
          console.log('promise 1 executed');
          res(true);
      }, 1000);
    });
  }
  
  function waitTwoSecond() {
      return new Promise((res, rej) => {
  
          setTimeout(() => {
              console.log('promise 2 executed');
              res(true);
          }, 2000);
        });
  }
  
  function waitThreeSecond() {
      return new Promise((res, rej) => {
  
          setTimeout(() => {
              console.log('promise 3 executed');
              res(true);
          }, 3000);
        });
  }
  
  async function calculateTime() {
      
      console.time();
      await waitOneSecond().then(value => {
        console.log(value);
        waitTwoSecond().then(value => {
            console.log(value);
            waitThreeSecond().then(value => {
                console.log(value);
                console.timeEnd();

            })
        })
      })
  
  }
  calculateTime();