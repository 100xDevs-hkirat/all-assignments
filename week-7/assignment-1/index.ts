// import app from './app.js';
// const app = require('./app')
// const mongoose = require('mongoose');
import app from './app';
import mongoose from 'mongoose';

const DATABASE_URI = "mongodb://localhost:27017";

const PORT = 5000;
const HOST = "192.168.214.215"

const mongooseConnect = () => {
    const reconnectTimeout = 5000;

    const connect = () => {
        mongoose.connect(DATABASE_URI);
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

const server = app.listen(PORT, HOST, () => {
    console.log(`Server listening on: http://${HOST}:${PORT}`);
});