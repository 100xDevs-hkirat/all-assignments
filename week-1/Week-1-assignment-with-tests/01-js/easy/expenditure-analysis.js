/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  
  let obj = {};

  for(let i=0; i<transactions.length; i++){

      if(obj[transactions[i].category]){
          obj[transactions[i].category] += transactions[i].price;
      }
      else{
          obj[transactions[i].category] = transactions[i].price;
      }
      
  }
  let arrayOfKeys = Object.keys(obj);
  let ans = [];
  
  for(let i=0; i<arrayOfKeys.length; i++){
      let currObj = {
          category: arrayOfKeys[i],
          totalSpent: obj[arrayOfKeys[i]]
      }
      ans.push(currObj);
  }

  return ans;
}

module.exports = calculateTotalSpentByCategory;
