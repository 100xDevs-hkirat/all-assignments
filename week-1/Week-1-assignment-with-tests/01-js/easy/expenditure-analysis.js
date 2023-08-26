/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  var res = new Map(); 
  var ans = [];
  for(var i =0 ; i<transactions.length;i++){
    var cat  = transactions[i].category;
    var prc = transactions[i].price;
    if(res.has(cat)){
      res.set(cat,res.get(cat)+prc);
    }
    else{
      res.set(cat,prc);
    }
  }
  res.forEach((value,key)=>{
    ans.push({"category": key, "totalSpent":value},);
  })
  return ans;
}

module.exports = calculateTotalSpentByCategory;
