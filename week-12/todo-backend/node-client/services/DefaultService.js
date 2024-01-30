"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class DefaultService {
    /**
     * @param todoId
     * @returns Todo Ok
     * @throws ApiError
     */
    static getTodo(todoId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/todo/{todoId}',
            path: {
                'todoId': todoId,
            },
        });
    }
}
exports.DefaultService = DefaultService;
