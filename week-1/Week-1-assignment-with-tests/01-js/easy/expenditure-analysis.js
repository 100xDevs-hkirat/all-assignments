/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
   var uniquecat={};
   for (var transaction of transactions){
       if(!uniquecat[transaction.category]){
        uniquecat[transaction.category]=transaction.price ;
       }
       else{
        uniquecat[transaction.category]+=transaction.price
       }
       
   }

var keys =Object.keys(uniquecat);
answer=[];
for (var key of keys){
  // console.log(key)
  varcategory = key ;
    var obj =  {
      category : key  ,
      totalSpent : uniquecat[key]
    } ; 
    answer.push(obj)
}

// console.log(answer)  ; 
return answer ;

  
}

const transactions = [
  {
    id: 1,
    timestamp: 1656076800000,
    price: 10,
    category: 'Food',
    itemName: 'Pizza',
  },
];

console.log(calculateTotalSpentByCategory(transactions))
module.exports = calculateTotalSpentByCategory;
