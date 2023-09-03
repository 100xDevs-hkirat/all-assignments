import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI } = process.env;

if(!MONGO_URI) {
    console.log("Mongo uri missing");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch(e) {
        console.log(e);
        process.exit(1);
    }
}

export default connectDB;