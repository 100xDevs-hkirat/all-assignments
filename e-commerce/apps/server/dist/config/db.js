"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGO_URI } = process.env;
if (!MONGO_URI) {
    console.log("Mongo uri missing");
    process.exit(1);
}
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("MongoDB connected");
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
};
exports.default = connectDB;
