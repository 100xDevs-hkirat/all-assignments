/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  const expenditure = {};
  transactions.forEach((transaction) => {
    if (!expenditure[`${transaction.category}`]) {
      expenditure[`${transaction.category}`] = 0;
    }
    expenditure[`${transaction.category}`] += transaction.price;
  });
  return Object.keys(expenditure).map((item) => {
    return { category: item, totalSpent: expenditure[`${item}`] };
  });
}

calculateTotalSpentByCategory([
  { itemName: "pen", category: "study", price: 10 },
  { itemName: "pencil", category: "study", price: 5 },
  { itemName: "papaya", category: "food", price: 10 },
]);

module.exports = calculateTotalSpentByCategory;
