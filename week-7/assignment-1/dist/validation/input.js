"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = exports.Username = void 0;
const zod_1 = require("zod");
// does not match username containing numbers
const usernameRegex = new RegExp('^([^0-9]*)$');
const passwordRegex = new RegExp('[A-Z]');
exports.Username = zod_1.z.string().min(4).max(12).regex(usernameRegex);
exports.Password = zod_1.z.string().min(8).max(22).regex(passwordRegex);
