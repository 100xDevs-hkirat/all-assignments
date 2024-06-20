const mongoose = require("mongoose");
const URL = "mongodb+srv://akash:XeYwBV9nEDB5gla9@cluster0.sh9hicz.mongodb.net/?retryWrites=true&w=majority";
const connectDb = async () => {

     try {
        const con = await mongoose.connect(URL,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });
     console.log(`Connected to MongoDB:${ con.connection.host }`);
    }
    catch (error) { 
        console.log(err);
    }
}

module.exports = connectDb;