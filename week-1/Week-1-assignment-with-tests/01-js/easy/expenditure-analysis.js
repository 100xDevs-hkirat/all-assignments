/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  let result = [];
  result.push({
    category: transactions[0].category,
    totalSpent: transactions[0].price,
  });
  for (var i = 1; i < transactions.length; i++) {
    var exists = false;
    for (var j = 0; j < result.length; j++) {
      if (transactions[i].category == result[j].category) {
        result[j].totalSpent = result[j].totalSpent + transactions[i].price;
        exists = true;
      }
    }
    if (!exists)
      result.push({
        category: transactions[i].category,
        totalSpent: transactions[i].price,
      });
  }

  return result;
}

module.exports = calculateTotalSpentByCategory;
