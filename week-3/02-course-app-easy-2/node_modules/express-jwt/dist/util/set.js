"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = void 0;
// from https://stackoverflow.com/a/54733755
function set(obj, path, value) {
    if (typeof obj !== 'object') {
        return obj;
    }
    if (typeof path === 'string') {
        path = path.toString().match(/[^.[\]]+/g) || [];
    }
    path.slice(0, -1).reduce(function (a, c, i) {
        return Object(a[c]) === a[c] // Does the key exist and is its value an object?
            // Yes: then follow that path
            ? a[c]
            // No: create the key. Is the next key a potential array-index?
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            : a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1]
                ? [] // Yes: assign a new array object
                : {};
    }, // No: assign a new plain object
    obj)[path[path.length - 1]] = value; // Finally assign the value to the last key
    return obj; // Return the top-level object to allow chaining
}
exports.set = set;
