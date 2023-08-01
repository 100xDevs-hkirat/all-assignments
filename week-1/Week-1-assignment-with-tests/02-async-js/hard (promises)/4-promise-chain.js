/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

    function waitOneSecond() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('Promise resolved after 1 second');
          }, 1000);
        });
      }
      
      function waitTwoSeconds() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('Promise resolved after 2 seconds');
          }, 2000);
        });
      }
      
      function waitThreeSeconds() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('Promise resolved after 3 seconds');
          }, 3000);
        });
      }
      async function sequentiallyCallPromises() {
        const startTime = Date.now();
        
        try {
          const result1 = await waitOneSecond();
          console.log(result1);
      
          const result2 = await waitTwoSeconds();
          console.log(result2);
      
          const result3 = await waitThreeSeconds();
          console.log(result3);
      
          const endTime = Date.now();
          console.log('Time taken for entire operation:', endTime - startTime, 'milliseconds');
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
      sequentiallyCallPromises();
      
      