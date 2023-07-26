// import app from './app.js';
const app = require('./app')
const mongoose = require('mongoose');

const DATABASE_URI = "mongodb://localhost:27017";

const PORT = 3000;

const mongooseConnect = () => {
    const reconnectTimeout = 5000;

    const connect = () => {
        mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
        
        mongoose.Promise = global.Promise; // ????
        
        const db = mongoose.connection;
        
        db.on('connecting', () => {
            console.log('Connecting to MongoDB...');
        });

        db.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
            mongoose.disconnect;
        });

        db.on('connected', () => {
            console.log('Connected to MongoDB!');
        });

        db.once('open', () => {
            console.log('MongoDB connection opened!');
        });

        db.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

        db.on('disconnected', () => {
            console.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
            setTimeout(() => connect(), reconnectTimeout);
        });

        connect();
};

mongooseConnect();

const server = app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
});