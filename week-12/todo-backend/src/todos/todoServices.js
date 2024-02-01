"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
class TodoService {
    get(todoId) {
        return {
            id: todoId,
            title: "Mocked Todo",
            description: "Mocked Todo",
            done: false,
        };
    }
    create(todoCreationParams) {
        return {
            id: "2",
            title: (todoCreationParams === null || todoCreationParams === void 0 ? void 0 : todoCreationParams.title) || "Title New",
            description: (todoCreationParams === null || todoCreationParams === void 0 ? void 0 : todoCreationParams.description) || "description New",
            done: false,
        };
    }
}
exports.TodoService = TodoService;
