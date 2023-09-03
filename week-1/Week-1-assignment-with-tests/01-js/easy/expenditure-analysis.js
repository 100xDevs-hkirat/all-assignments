/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  let ans = [];

  for (let i = 0; i < transactions.length; i++) {
    let newCat = transactions[i].category;
    let newPrice = transactions[i].price;
    let alreadyPresent = false;

    for (let j = 0; j < ans.length; j++) {
      if (ans[j].category === newCat) {
        alreadyPresent = true;
        ans[j].totalSpent += transactions[i].price;
        break;
      }
    }

    if (!alreadyPresent) {
      ans.push({ category: newCat, totalSpent: newPrice });
    }
  }
  console.log(ans);
  return ans;
}

module.exports = calculateTotalSpentByCategory;
