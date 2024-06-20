/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  var dict1 = {};
  for (var i = 0; i < transactions.length; i++) {
    var cat = transactions[i].category;
    if (cat in dict1) {
      dict1[cat] = dict1[cat] + transactions[i].price;
    } else {
      dict1[cat] = transactions[i].price;
    }
  }
  var answer = [];
  for (var i in dict1) {
    answer.push({
      category: i,
      totalSpent: dict1[i],
    });
  }
  // for (var i = 0; i < answer.length; i++) {
  //   console.log(answer[i]);
  // }
  return answer;
}

module.exports = calculateTotalSpentByCategory;
