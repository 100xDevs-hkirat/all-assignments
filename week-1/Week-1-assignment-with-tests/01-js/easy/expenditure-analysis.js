/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  var categorySpent = [];
  if (transactions.length !== 0) {
    categorySpent.push({ category: transactions[0].category, totalSpent: transactions[0].price });

    for (var i = 1; i < transactions.length; i++) {
      var categoryFound = false;
      for (var j = 0; j < categorySpent.length; j++) {
        if (categorySpent[j].category === transactions[i].category) {
          categorySpent[j].totalSpent += transactions[i].price;
          categoryFound = true;
          break;
        }
      }
      if (categoryFound != true) {
        categorySpent.push({ category: transactions[i].category, totalSpent: transactions[i].price });
      }
    }
  }
  return categorySpent;
}

module.exports = calculateTotalSpentByCategory;
