/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/
// Transactions Format:--
// const transactions = [
//   { itemName: "Maggie", category: "Food", price: 100, timestamp: "xx-yy-zzzz" },
//   { itemName: "Pasta", category: "Food", price: 200, timestamp: "xx-yy-zzzz" },
//   { itemName: "Brownie", category: "Food", price: 75, timestamp: "xx-yy-zzzz" },
//   {
//     itemName: "Adapter",
//     category: "Accessory",
//     price: 1900,
//     timestamp: "xx-yy-zzzz",
//   },
//   {
//     itemName: "Desk-Lamp",
//     category: "Accessory",
//     price: 3500,
//     timestamp: "xx-yy-zzzz",
//   },
// ];

// // //Output Format:--
// [
//   { category: "Food", toatalSpent: 375 },
//   { category: "Accessory", toatalSpent: 5400 }
// ];

function calculateTotalSpentByCategory(transactions) {
  const categories = [];
  const finalArr = [];
  transactions.forEach((transaction) => {
    if (!categories.includes(transaction.category)) {
      categories.push(transaction.category);
      finalArr.push({
        category: transaction.category,
        totalSpent: transaction.price,
      });
    } else {
      finalArr[categories.indexOf(transaction.category)].totalSpent +=
        transaction.price;
    }
  });
  return finalArr;
}
module.exports = calculateTotalSpentByCategory;
