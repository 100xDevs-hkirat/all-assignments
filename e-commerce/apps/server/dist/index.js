"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = __importDefault(require("./config/db"));
const items_1 = __importDefault(require("./routers/items"));
const auth_1 = __importDefault(require("./routers/auth"));
const cart_routes_1 = __importDefault(require("./routers/cart.routes"));
const order_routes_1 = __importDefault(require("./routers/order.routes"));
const product_routes_1 = __importDefault(require("./routers/product.routes"));
dotenv.config();
(0, db_1.default)();
const PORT = parseInt(process.env.PORT, 10);
if (!PORT) {
    process.exit(1);
}
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/items', items_1.default);
app.use('/auth', auth_1.default);
app.use('/cart', cart_routes_1.default);
app.use('/orders', order_routes_1.default);
app.use('/products', product_routes_1.default);
app.listen(PORT, () => {
    console.log(`Listening on port  ${PORT}`);
});
