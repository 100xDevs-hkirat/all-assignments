### This project contains the backend for a simple todo app
Convert this from JS to typescript.
We have a simple backend for a TODO application.
First, just go through the codebase and make sure you understand it. There is a postman collection for you to try this out locally
Run node index.js to run the app locally and try all the routes in postman.
You WILL need mongoDB running locally, or a cloud mongoDB instance. Please replace the mongoDB url in index.js with your own mongoDB url.

### Steps to follow
 - First step in doing this is to convert the JS files to TS files (replacing the extension of all files).
 - Next, run `tsc --init` to create a tsconfig.json file (make sure u already have tsc (npm i -g tsc)).
 - Set strict to false for now until we add all types.
 - Set outDir to dist so as to not pollute your original folder
 - Try running it, notice the errors that you see.
   - The errors you will see should be of the format 
   - 'mongoose' was also declared here.
   - Move all requires => imports to fix these errors. This is related to a bug bug in TS (https://stackoverflow.com/questions/35758584/cannot-redeclare-block-scoped-variable)
   - For example, convert
     - `const mongoose = require('mongoose');` to
     - `import mongoose from 'mongoose';`
   - Same thing for exports, export using the modern ES6 syntax
     - `module.exports = mongoose.model('Todo', todoSchema);` to
     - `export default mongoose.model('Todo', todoSchema);`
 - Now typescript shouldnt complain, but this isn't the end. We still have to flip on strict to actually see errors.
 - Check out the errors that you see
 - Next, run `npm install -D @types/node` to install the types for node.
 - Next, run `npm install -D @types/express` to install the types for express.
 - Next, run `npm install -D @types/mongoose` to install the types for mongoose.
 - You will see a bunch of `Parameter 'req' implicitly has an 'any' type.` errors. Fix these by adding types to all the functions.
   - Express exports the Request and Response types, use them to type the req and res params.
   - If you ever get stuck, initially you can use the any type
   - You can also just flip noImplicitAny to false in tsconfig, but that's cheating.
 - You will see req.userId complains everywhere, and rightfully so. We've added userId key to an object that doesn't expect it. Fix this by sending over the id via the headers.
 - Create types for the inputs to all routes (for eg User, Todo) and use them when u decode the body.
 - Try running tsc now, you should see no errors. 
