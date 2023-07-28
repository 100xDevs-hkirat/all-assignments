function wordFrequency(words) {
    let frequency = new Map();

    // let i=1;
    for(let word of words) 
    {
        if(!frequency.has(word)) {
            frequency.set(word, 1);
        }else{
            let current = frequency.get(word);
            frequency.set(word, current = current+1);
        }
    }
    console.log(frequency);
}

const words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const f = wordFrequency(words);

console.log(f);