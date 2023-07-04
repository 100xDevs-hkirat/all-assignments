/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/
const group = (transactions) => {
  return transactions.reduce((acc, obj) => {
    const key = obj.category
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

function calculateTotalSpentByCategory(transactions) {
  const grouped = group(transactions)

  let output = []

  for (const [category, arr] of Object.entries(grouped)) {
    const price = arr.reduce((accumulator, obj) => accumulator + obj.price, 0)
    output.push({ category, totalSpent: price })
  }

  return output
}

const transactions = [
  {
    id: 1,
    timestamp: 1656076800000,
    price: 10,
    category: 'Food',
    itemName: 'Pizza',
  },
  {
    id: 2,
    timestamp: 1656259600000,
    price: 20,
    category: 'Food',
    itemName: 'Burger',
  },
]

console.log(transactions)
console.log('------------')
console.log(calculateTotalSpentByCategory(transactions))

module.exports = calculateTotalSpentByCategory
