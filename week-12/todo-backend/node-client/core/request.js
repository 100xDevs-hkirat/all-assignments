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
exports.request = exports.catchErrorCodes = exports.getResponseBody = exports.getResponseHeader = exports.sendRequest = exports.getRequestBody = exports.getHeaders = exports.resolve = exports.getFormData = exports.getQueryString = exports.base64 = exports.isFormData = exports.isBlob = exports.isStringWithValue = exports.isString = exports.isDefined = void 0;
/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
const ApiError_1 = require("./ApiError");
const CancelablePromise_1 = require("./CancelablePromise");
const isDefined = (value) => {
    return value !== undefined && value !== null;
};
exports.isDefined = isDefined;
const isString = (value) => {
    return typeof value === 'string';
};
exports.isString = isString;
const isStringWithValue = (value) => {
    return (0, exports.isString)(value) && value !== '';
};
exports.isStringWithValue = isStringWithValue;
const isBlob = (value) => {
    return (typeof value === 'object' &&
        typeof value.type === 'string' &&
        typeof value.stream === 'function' &&
        typeof value.arrayBuffer === 'function' &&
        typeof value.constructor === 'function' &&
        typeof value.constructor.name === 'string' &&
        /^(Blob|File)$/.test(value.constructor.name) &&
        /^(Blob|File)$/.test(value[Symbol.toStringTag]));
};
exports.isBlob = isBlob;
const isFormData = (value) => {
    return value instanceof FormData;
};
exports.isFormData = isFormData;
const base64 = (str) => {
    try {
        return btoa(str);
    }
    catch (err) {
        // @ts-ignore
        return Buffer.from(str).toString('base64');
    }
};
exports.base64 = base64;
const getQueryString = (params) => {
    const qs = [];
    const append = (key, value) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };
    const process = (key, value) => {
        if ((0, exports.isDefined)(value)) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    process(key, v);
                });
            }
            else if (typeof value === 'object') {
                Object.entries(value).forEach(([k, v]) => {
                    process(`${key}[${k}]`, v);
                });
            }
            else {
                append(key, value);
            }
        }
    };
    Object.entries(params).forEach(([key, value]) => {
        process(key, value);
    });
    if (qs.length > 0) {
        return `?${qs.join('&')}`;
    }
    return '';
};
exports.getQueryString = getQueryString;
const getUrl = (config, options) => {
    const encoder = config.ENCODE_PATH || encodeURI;
    const path = options.url
        .replace('{api-version}', config.VERSION)
        .replace(/{(.*?)}/g, (substring, group) => {
        var _a;
        if ((_a = options.path) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(group)) {
            return encoder(String(options.path[group]));
        }
        return substring;
    });
    const url = `${config.BASE}${path}`;
    if (options.query) {
        return `${url}${(0, exports.getQueryString)(options.query)}`;
    }
    return url;
};
const getFormData = (options) => {
    if (options.formData) {
        const formData = new FormData();
        const process = (key, value) => {
            if ((0, exports.isString)(value) || (0, exports.isBlob)(value)) {
                formData.append(key, value);
            }
            else {
                formData.append(key, JSON.stringify(value));
            }
        };
        Object.entries(options.formData)
            .filter(([_, value]) => (0, exports.isDefined)(value))
            .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => process(key, v));
            }
            else {
                process(key, value);
            }
        });
        return formData;
    }
    return undefined;
};
exports.getFormData = getFormData;
const resolve = (options, resolver) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof resolver === 'function') {
        return resolver(options);
    }
    return resolver;
});
exports.resolve = resolve;
const getHeaders = (config, options) => __awaiter(void 0, void 0, void 0, function* () {
    const [token, username, password, additionalHeaders] = yield Promise.all([
        (0, exports.resolve)(options, config.TOKEN),
        (0, exports.resolve)(options, config.USERNAME),
        (0, exports.resolve)(options, config.PASSWORD),
        (0, exports.resolve)(options, config.HEADERS),
    ]);
    const headers = Object.entries(Object.assign(Object.assign({ Accept: 'application/json' }, additionalHeaders), options.headers))
        .filter(([_, value]) => (0, exports.isDefined)(value))
        .reduce((headers, [key, value]) => (Object.assign(Object.assign({}, headers), { [key]: String(value) })), {});
    if ((0, exports.isStringWithValue)(token)) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if ((0, exports.isStringWithValue)(username) && (0, exports.isStringWithValue)(password)) {
        const credentials = (0, exports.base64)(`${username}:${password}`);
        headers['Authorization'] = `Basic ${credentials}`;
    }
    if (options.body) {
        if (options.mediaType) {
            headers['Content-Type'] = options.mediaType;
        }
        else if ((0, exports.isBlob)(options.body)) {
            headers['Content-Type'] = options.body.type || 'application/octet-stream';
        }
        else if ((0, exports.isString)(options.body)) {
            headers['Content-Type'] = 'text/plain';
        }
        else if (!(0, exports.isFormData)(options.body)) {
            headers['Content-Type'] = 'application/json';
        }
    }
    return new Headers(headers);
});
exports.getHeaders = getHeaders;
const getRequestBody = (options) => {
    var _a;
    if (options.body !== undefined) {
        if ((_a = options.mediaType) === null || _a === void 0 ? void 0 : _a.includes('/json')) {
            return JSON.stringify(options.body);
        }
        else if ((0, exports.isString)(options.body) || (0, exports.isBlob)(options.body) || (0, exports.isFormData)(options.body)) {
            return options.body;
        }
        else {
            return JSON.stringify(options.body);
        }
    }
    return undefined;
};
exports.getRequestBody = getRequestBody;
const sendRequest = (config, options, url, body, formData, headers, onCancel) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new AbortController();
    const request = {
        headers,
        body: body !== null && body !== void 0 ? body : formData,
        method: options.method,
        signal: controller.signal,
    };
    if (config.WITH_CREDENTIALS) {
        request.credentials = config.CREDENTIALS;
    }
    onCancel(() => controller.abort());
    return yield fetch(url, request);
});
exports.sendRequest = sendRequest;
const getResponseHeader = (response, responseHeader) => {
    if (responseHeader) {
        const content = response.headers.get(responseHeader);
        if ((0, exports.isString)(content)) {
            return content;
        }
    }
    return undefined;
};
exports.getResponseHeader = getResponseHeader;
const getResponseBody = (response) => __awaiter(void 0, void 0, void 0, function* () {
    if (response.status !== 204) {
        try {
            const contentType = response.headers.get('Content-Type');
            if (contentType) {
                const jsonTypes = ['application/json', 'application/problem+json'];
                const isJSON = jsonTypes.some(type => contentType.toLowerCase().startsWith(type));
                if (isJSON) {
                    return yield response.json();
                }
                else {
                    return yield response.text();
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return undefined;
});
exports.getResponseBody = getResponseBody;
const catchErrorCodes = (options, result) => {
    var _a, _b;
    const errors = Object.assign({ 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable' }, options.errors);
    const error = errors[result.status];
    if (error) {
        throw new ApiError_1.ApiError(options, result, error);
    }
    if (!result.ok) {
        const errorStatus = (_a = result.status) !== null && _a !== void 0 ? _a : 'unknown';
        const errorStatusText = (_b = result.statusText) !== null && _b !== void 0 ? _b : 'unknown';
        const errorBody = (() => {
            try {
                return JSON.stringify(result.body, null, 2);
            }
            catch (e) {
                return undefined;
            }
        })();
        throw new ApiError_1.ApiError(options, result, `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`);
    }
};
exports.catchErrorCodes = catchErrorCodes;
/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
const request = (config, options) => {
    return new CancelablePromise_1.CancelablePromise((resolve, reject, onCancel) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = getUrl(config, options);
            const formData = (0, exports.getFormData)(options);
            const body = (0, exports.getRequestBody)(options);
            const headers = yield (0, exports.getHeaders)(config, options);
            if (!onCancel.isCancelled) {
                const response = yield (0, exports.sendRequest)(config, options, url, body, formData, headers, onCancel);
                const responseBody = yield (0, exports.getResponseBody)(response);
                const responseHeader = (0, exports.getResponseHeader)(response, options.responseHeader);
                const result = {
                    url,
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    body: responseHeader !== null && responseHeader !== void 0 ? responseHeader : responseBody,
                };
                (0, exports.catchErrorCodes)(options, result);
                resolve(result.body);
            }
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.request = request;
