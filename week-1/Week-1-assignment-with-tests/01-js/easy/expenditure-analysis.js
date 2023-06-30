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
    let cat="";
    let flag=1;
    let ind=0;
    let pri=0;
    let outarr=[];

    for(let i = 0; i<transactions.length; i++)
    {
        cat = transactions[i].category;
        pri = transactions[i].price;
        flag=0;

        for(let j = 0; j<outarr.length; j++)
        {
            if(cat==outarr[j].category)
            {
                outarr[j].totalSpent += pri;
                flag=1;
                break;
            }
        }

        if(flag==0)
        {
            ind = outarr.length;
            outarr[ind] = {category: cat, totalSpent: pri};
        }
    }

    return outarr;
}

module.exports = calculateTotalSpentByCategory;
