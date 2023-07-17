/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  const map=new Map();
  let n=transactions.length;
  for(let i=0;i<n;i++){
    let obj=transactions[i];
    let cat=obj.category;
    let price=obj.price
    if(map.has(cat)){
      map.set(cat,map.get(cat)+price)
    }
    else{
      map.set(cat,price);
    }
  }
  let arr=[]
  for(const keys1 of map.keys()){

    obj={
      category: keys1, totalSpent: map.get(keys1)
    }
    arr.push(obj);
  }
  return arr;

}

module.exports = calculateTotalSpentByCategory;
