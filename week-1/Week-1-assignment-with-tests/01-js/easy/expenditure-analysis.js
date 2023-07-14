/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  let catarr = [];

  transactions.forEach((cat) => {
    const idx = catarr.findIndex((c) => c.category === cat.category);

    if (idx < 0) {
      catarr.push({ category: cat.category, totalSpent: cat.price });
    } else {
      catarr[idx].totalSpent += cat.price;
    }
  });

  return catarr;
}

module.exports = calculateTotalSpentByCategory;
