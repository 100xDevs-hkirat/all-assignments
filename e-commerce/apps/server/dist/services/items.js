"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const findAll = async () => {
    try {
        const read = await promises_1.default.readFile("../book_details.json", "utf-8");
        const data = JSON.parse(read);
        return {
            statusCode: 200,
            body: data,
        };
    }
    catch (e) {
        console.log(e);
        return { statusCode: 500, body: [] };
    }
};
exports.findAll = findAll;
