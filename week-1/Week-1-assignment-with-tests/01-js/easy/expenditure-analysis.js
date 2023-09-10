/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  var categories={};
  
  for(var i=0;i<transactions.length;i++)
  {
    var category = transactions[i].category;
    var price = transactions[i].price;

    if(categories.hasOwnProperty(category)){
      categories[category] += price;
    }
    else{
      categories[category] = price;
    }
  }

  var result = [];
  for(var category in categories){
    var obj={};
    obj[category]= categories[category];
    result.push(obj);
  }
  return result;
}

let arr1 = [
  { itemName: "Colagte", category: "grocery", price: 20, timeStamp: "2:00 PM" },
  { itemName: "Shapoo", category: "grocery", price: 89, timeStamp: "2:05 PM" },
  { itemName: "Face Wash", category: "grocery", price: 234, timeStamp: "2:07 PM" },
  { itemName: "Coffee", category: "food", price: 90, timeStamp: "3:00 PM" },
  { itemName: "Pizza", category: "food", price: 300, timeStamp: "2:00 PM" },
];

module.exports = calculateTotalSpentByCategory;
