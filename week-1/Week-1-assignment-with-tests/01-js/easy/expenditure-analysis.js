function calculateTotalSpentByCategory(transactions){
  let outp = {};
  for (let i = 0; i<transactions.length; i++){
    let obj = transactions[i];
    if(outp[obj.category]){
      outp[obj.category] += obj.price;
    }
    else {
      outp[obj.category] = obj.price;
    }
    
  }
  let keys = Object.keys(outp)
  
  let answer = []
  
  for(let i =0; i<keys.length; i++){
    let obj = {
      category: keys[i],
      totalSpent: outp[keys[i]]
    }
    answer.push(obj)
  }
  return answer
}

module.exports= calculateTotalSpentByCategory