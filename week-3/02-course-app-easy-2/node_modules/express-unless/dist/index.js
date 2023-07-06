"use strict";
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
exports.unless = void 0;
const URL = require("url");
function unless(options) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const middleware = this;
    const opts = typeof options === 'function' ?
        { custom: options } :
        options;
    opts.useOriginalUrl = (typeof opts.useOriginalUrl === 'undefined') ? true : opts.useOriginalUrl;
    const result = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = URL.parse((opts.useOriginalUrl ? req.originalUrl : req.url) || req.url || '', true);
            let skip = false;
            if (opts.custom) {
                skip = skip || (yield opts.custom(req));
            }
            const paths = toArray(opts.path);
            if (paths) {
                skip = skip || paths.some(function (p) {
                    if (typeof p === 'string' || p instanceof RegExp) {
                        return isUrlMatch(p, url.pathname);
                    }
                    else {
                        return isUrlMatch(p, url.pathname) && isMethodMatch(p.method || p.methods, req.method);
                    }
                });
            }
            if (typeof opts.ext !== 'undefined') {
                const exts = toArray(opts.ext);
                skip = skip || exts.some(function (ext) {
                    return url.pathname.slice(ext.length * -1) === ext;
                });
            }
            if (typeof opts.method !== 'undefined') {
                const methods = toArray(opts.method);
                skip = skip || methods.indexOf(req.method) > -1;
            }
            if (skip) {
                return next();
            }
            middleware(req, res, next);
        });
    };
    result.unless = unless;
    return result;
}
exports.unless = unless;
function toArray(elementOrArray) {
    return Array.isArray(elementOrArray) ? elementOrArray : [elementOrArray];
}
function isUrlMatch(p, url) {
    if (typeof p === 'string') {
        return p === url;
    }
    if (p instanceof RegExp) {
        return url.match(p) !== null;
    }
    if (typeof p === 'object' && p.url) {
        return isUrlMatch(p.url, url);
    }
    return false;
}
function isMethodMatch(methods, m) {
    if (typeof methods === 'undefined') {
        return true;
    }
    return toArray(methods).includes(m);
}
