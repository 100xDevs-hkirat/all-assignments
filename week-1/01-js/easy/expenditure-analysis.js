/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) 
{
  let mp = new Map();
  for(let it of transactions)
  {
    if(!mp.has(it.category))    //element not present
      mp.set(it.category,it.price);
    else                        //element already present
      mp.set(it.category,mp.get(it.category)+it.price);
  }

  let ans = [];
  for(let it of mp)
  {
    let obj = new Object();
    obj.category = it[0];
    obj.totalSpent = it[1];
    ans.push(obj);
    // ans.push({category:it[0],totalSpent:it[1]});        //shorter way and it also works
  }

  return ans;
}

module.exports = calculateTotalSpentByCategory;
