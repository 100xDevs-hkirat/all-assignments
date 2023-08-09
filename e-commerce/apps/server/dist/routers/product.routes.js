"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const product_1 = require("../controllers/product");
const router = express_1.default.Router();
router.get('/', auth_1.default, product_1.getAllProductsController);
router.get('/:id', auth_1.default, product_1.getProductByIdController);
router.post('/', auth_1.default, product_1.createProductController);
router.put('/:id', auth_1.default, product_1.updateProductController);
router.delete('/:id', auth_1.default, product_1.deleteProductController);
exports.default = router;
