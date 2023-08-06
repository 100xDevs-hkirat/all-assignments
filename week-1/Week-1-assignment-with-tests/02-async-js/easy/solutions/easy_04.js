const fs = require('fs')
fs.writeFile('a.txt', 'Mayank SIngh', function(err) {
    if (err) {
      console.log(err)
    }
  })