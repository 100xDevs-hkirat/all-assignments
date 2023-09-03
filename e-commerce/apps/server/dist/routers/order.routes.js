"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const order_1 = require("../controllers/order");
const router = express_1.default.Router();
router.get('/', auth_1.default, order_1.getOrderController);
router.post('/', auth_1.default, order_1.createOrderController);
exports.default = router;
