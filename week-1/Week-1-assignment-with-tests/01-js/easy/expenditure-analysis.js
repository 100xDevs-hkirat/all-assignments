/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  spendEstimates=[];
  for(var i=0;i<transactions.length;i++){
    var t=transactions[i];
    if(spendEstimates[t.category]){
      spendEstimates[t.category]=spendEstimates[t.category]+t.price;
    }
    else{
      spendEstimates[t.category]=t.price;
    }

  }
  console.log(spendEstimates);
}

transactions=[{
  itemName:"Shawarma",
  category:"Food",
  price:80,
  timestamp: "08-12-23"
},
{
  itemName:"Mountain Dew",
  category:"Drink",
  price:25,
  timestamp: "09-12-23"
},
{
  itemName:"Masala Dosa",
  category:"Food",
  price:45,
  timestamp: "11-12-23"
},
{
  itemName:"Badam Milk",
  category:"Drink",
  price:20,
  timestamp: "12-12-23",


}];
console.log(calculateTotalSpentByCategory(transactions));

module.exports = calculateTotalSpentByCategory;
