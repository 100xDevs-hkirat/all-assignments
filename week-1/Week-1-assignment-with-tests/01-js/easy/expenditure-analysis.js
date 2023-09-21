/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/
function calculateTotalSpentByCategory(transactions) {
  let map = {};
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    if (map[transaction.category]) {
      map[transaction.category] += transaction.price;
    } else {
      map[transaction.category] = transaction.price;
    }
  }
  // let total = Object.entries(map);
  // let answer = [];
  // for (let i = 0; i < total.length; i++) {
  //   answer.push({
  //     category: total[i][0],
  //     amountSpent: total[i][1],
  //   });
  // }
  // console.log(answer);
  let keys = Object.keys(map);
  let answer = [];
  for (let i = 0; i < keys.length; i++) {
    // let category = keys[i];
    answer.push({
      category: keys[i],
      totalSpent: map[keys[i]],
    });
  }
  return answer;
}

module.exports = calculateTotalSpentByCategory;
