/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {

  // length of output array not predefined. Dict -> Array
  catTots = {}

  for (let i=0; i<transactions.length; i++){
    transaction = transactions[i]
    if (transaction['category'] in catTots){
      catTots[transaction['category']] += transaction['price']
    }
    else{
      catTots[transaction['category']] = transaction['price']
    }
  }

  resultList = Object.keys(catTots).map(category => ({
    'category': category,
    'totalSpent': catTots[category]
  }))

  return resultList;
}

module.exports = calculateTotalSpentByCategory;
