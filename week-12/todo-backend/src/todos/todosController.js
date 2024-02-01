"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const tsoa_1 = require("tsoa");
const todoServices_1 = require("./todoServices");
// ROUTE -> /todo/:todoId
let TodoController = class TodoController extends tsoa_1.Controller {
    getTodo(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            let todoService = new todoServices_1.TodoService();
            return todoService.get(todoId);
        });
    }
    createTodo(todoName) {
        return __awaiter(this, void 0, void 0, function* () {
            let todoService = new todoServices_1.TodoService();
            return todoService.create({ title: todoName, description: todoName });
        });
    }
};
exports.TodoController = TodoController;
__decorate([
    (0, tsoa_1.Get)("{todoId}"),
    __param(0, (0, tsoa_1.Path)())
], TodoController.prototype, "getTodo", null);
__decorate([
    (0, tsoa_1.Post)("{todoName}"),
    __param(0, (0, tsoa_1.Path)())
], TodoController.prototype, "createTodo", null);
exports.TodoController = TodoController = __decorate([
    (0, tsoa_1.Route)("todo")
], TodoController);
