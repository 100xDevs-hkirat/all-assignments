"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompress = exports.compress = exports.uncompressibleCommands = exports.Compressor = void 0;
const util_1 = require("util");
const zlib = require("zlib");
const constants_1 = require("../../constants");
const deps_1 = require("../../deps");
const error_1 = require("../../error");
/** @public */
exports.Compressor = Object.freeze({
    none: 0,
    snappy: 1,
    zlib: 2,
    zstd: 3
});
exports.uncompressibleCommands = new Set([
    constants_1.LEGACY_HELLO_COMMAND,
    'saslStart',
    'saslContinue',
    'getnonce',
    'authenticate',
    'createUser',
    'updateUser',
    'copydbSaslStart',
    'copydbgetnonce',
    'copydb'
]);
const ZSTD_COMPRESSION_LEVEL = 3;
const zlibInflate = (0, util_1.promisify)(zlib.inflate.bind(zlib));
const zlibDeflate = (0, util_1.promisify)(zlib.deflate.bind(zlib));
// Facilitate compressing a message using an agreed compressor
async function compress(options, dataToBeCompressed) {
    const zlibOptions = {};
    switch (options.agreedCompressor) {
        case 'snappy':
            if ('kModuleError' in deps_1.Snappy) {
                throw deps_1.Snappy['kModuleError'];
            }
            return deps_1.Snappy.compress(dataToBeCompressed);
        case 'zstd':
            if ('kModuleError' in deps_1.ZStandard) {
                throw deps_1.ZStandard['kModuleError'];
            }
            return deps_1.ZStandard.compress(dataToBeCompressed, ZSTD_COMPRESSION_LEVEL);
        case 'zlib':
            if (options.zlibCompressionLevel) {
                zlibOptions.level = options.zlibCompressionLevel;
            }
            return zlibDeflate(dataToBeCompressed, zlibOptions);
        default:
            throw new error_1.MongoInvalidArgumentError(`Unknown compressor ${options.agreedCompressor} failed to compress`);
    }
}
exports.compress = compress;
// Decompress a message using the given compressor
async function decompress(compressorID, compressedData) {
    if (compressorID !== exports.Compressor.snappy &&
        compressorID !== exports.Compressor.zstd &&
        compressorID !== exports.Compressor.zlib &&
        compressorID !== exports.Compressor.none) {
        throw new error_1.MongoDecompressionError(`Server sent message compressed using an unsupported compressor. (Received compressor ID ${compressorID})`);
    }
    switch (compressorID) {
        case exports.Compressor.snappy:
            if ('kModuleError' in deps_1.Snappy) {
                throw deps_1.Snappy['kModuleError'];
            }
            return deps_1.Snappy.uncompress(compressedData, { asBuffer: true });
        case exports.Compressor.zstd:
            if ('kModuleError' in deps_1.ZStandard) {
                throw deps_1.ZStandard['kModuleError'];
            }
            return deps_1.ZStandard.decompress(compressedData);
        case exports.Compressor.zlib:
            return zlibInflate(compressedData);
        default:
            return compressedData;
    }
}
exports.decompress = decompress;
//# sourceMappingURL=compression.js.map