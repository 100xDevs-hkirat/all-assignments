/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  const categoryMap = new Map();

  transactions.forEach((transaction) => {
    const { category, price } = transaction;
    if (categoryMap.has(category)) {
      categoryMap.set(category, categoryMap.get(category) + price);
    } else {
      categoryMap.set(category, price);
    }
  });

  const result = [];

  for (let [category, totalSpent] of categoryMap) {
    const obj = { category, totalSpent };
    result.push(obj);
  }

  return result;
}

module.exports = calculateTotalSpentByCategory;
