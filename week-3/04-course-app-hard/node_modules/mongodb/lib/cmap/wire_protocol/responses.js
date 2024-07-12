"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorResponse = exports.MongoDBResponse = exports.isErrorResponse = void 0;
const bson_1 = require("../../bson");
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const document_1 = require("./on_demand/document");
/**
 * Accepts a BSON payload and checks for na "ok: 0" element.
 * This utility is intended to prevent calling response class constructors
 * that expect the result to be a success and demand certain properties to exist.
 *
 * For example, a cursor response always expects a cursor embedded document.
 * In order to write the class such that the properties reflect that assertion (non-null)
 * we cannot invoke the subclass constructor if the BSON represents an error.
 *
 * @param bytes - BSON document returned from the server
 */
function isErrorResponse(bson) {
    const elements = (0, bson_1.parseToElementsToArray)(bson, 0);
    for (let eIdx = 0; eIdx < elements.length; eIdx++) {
        const element = elements[eIdx];
        if (element[2 /* BSONElementOffset.nameLength */] === 2) {
            const nameOffset = element[1 /* BSONElementOffset.nameOffset */];
            // 111 == "o", 107 == "k"
            if (bson[nameOffset] === 111 && bson[nameOffset + 1] === 107) {
                const valueOffset = element[3 /* BSONElementOffset.offset */];
                const valueLength = element[4 /* BSONElementOffset.length */];
                // If any byte in the length of the ok number (works for any type) is non zero,
                // then it is considered "ok: 1"
                for (let i = valueOffset; i < valueOffset + valueLength; i++) {
                    if (bson[i] !== 0x00)
                        return false;
                }
                return true;
            }
        }
    }
    return true;
}
exports.isErrorResponse = isErrorResponse;
/** @internal */
class MongoDBResponse extends document_1.OnDemandDocument {
    static is(value) {
        return value instanceof MongoDBResponse;
    }
    /** Indicates this document is a server error */
    get isError() {
        let isError = this.ok === 0;
        isError ||= this.has('errmsg');
        isError ||= this.has('code');
        isError ||= this.has('$err'); // The '$err' field is used in OP_REPLY responses
        return isError;
    }
    /**
     * Drivers can safely assume that the `recoveryToken` field is always a BSON document but drivers MUST NOT modify the
     * contents of the document.
     */
    get recoveryToken() {
        return (this.get('recoveryToken', bson_1.BSONType.object)?.toObject({
            promoteValues: false,
            promoteLongs: false,
            promoteBuffers: false
        }) ?? null);
    }
    /**
     * The server creates a cursor in response to a snapshot find/aggregate command and reports atClusterTime within the cursor field in the response.
     * For the distinct command the server adds a top-level atClusterTime field to the response.
     * The atClusterTime field represents the timestamp of the read and is guaranteed to be majority committed.
     */
    get atClusterTime() {
        return (this.get('cursor', bson_1.BSONType.object)?.get('atClusterTime', bson_1.BSONType.timestamp) ??
            this.get('atClusterTime', bson_1.BSONType.timestamp));
    }
    get operationTime() {
        return this.get('operationTime', bson_1.BSONType.timestamp);
    }
    get ok() {
        return this.getNumber('ok') ? 1 : 0;
    }
    get $err() {
        return this.get('$err', bson_1.BSONType.string);
    }
    get errmsg() {
        return this.get('errmsg', bson_1.BSONType.string);
    }
    get code() {
        return this.getNumber('code');
    }
    get $clusterTime() {
        if (!('clusterTime' in this)) {
            const clusterTimeDoc = this.get('$clusterTime', bson_1.BSONType.object);
            if (clusterTimeDoc == null) {
                this.clusterTime = null;
                return null;
            }
            const clusterTime = clusterTimeDoc.get('clusterTime', bson_1.BSONType.timestamp, true);
            const signature = clusterTimeDoc.get('signature', bson_1.BSONType.object)?.toObject();
            // @ts-expect-error: `signature` is incorrectly typed. It is public API.
            this.clusterTime = { clusterTime, signature };
        }
        return this.clusterTime ?? null;
    }
    toObject(options) {
        const exactBSONOptions = {
            useBigInt64: options?.useBigInt64,
            promoteLongs: options?.promoteLongs,
            promoteValues: options?.promoteValues,
            promoteBuffers: options?.promoteBuffers,
            bsonRegExp: options?.bsonRegExp,
            raw: options?.raw ?? false,
            fieldsAsRaw: options?.fieldsAsRaw ?? {},
            validation: this.parseBsonSerializationOptions(options)
        };
        return super.toObject(exactBSONOptions);
    }
    parseBsonSerializationOptions(options) {
        const enableUtf8Validation = options?.enableUtf8Validation;
        if (enableUtf8Validation === false) {
            return { utf8: false };
        }
        return { utf8: { writeErrors: false } };
    }
}
// {ok:1}
MongoDBResponse.empty = new MongoDBResponse(new Uint8Array([13, 0, 0, 0, 16, 111, 107, 0, 1, 0, 0, 0, 0]));
exports.MongoDBResponse = MongoDBResponse;
/** @internal */
class CursorResponse extends MongoDBResponse {
    static is(value) {
        return value instanceof CursorResponse || value === CursorResponse.emptyGetMore;
    }
    constructor(bytes, offset, isArray) {
        super(bytes, offset, isArray);
        this.ns = null;
        this.batchSize = 0;
        this.iterated = 0;
        const cursor = this.get('cursor', bson_1.BSONType.object, true);
        const id = cursor.get('id', bson_1.BSONType.long, true);
        this.id = new bson_1.Long(Number(id & 0xffffffffn), Number((id >> 32n) & 0xffffffffn));
        const namespace = cursor.get('ns', bson_1.BSONType.string);
        if (namespace != null)
            this.ns = (0, utils_1.ns)(namespace);
        if (cursor.has('firstBatch'))
            this.batch = cursor.get('firstBatch', bson_1.BSONType.array, true);
        else if (cursor.has('nextBatch'))
            this.batch = cursor.get('nextBatch', bson_1.BSONType.array, true);
        else
            throw new error_1.MongoUnexpectedServerResponseError('Cursor document did not contain a batch');
        this.batchSize = this.batch.size();
    }
    get length() {
        return Math.max(this.batchSize - this.iterated, 0);
    }
    shift(options) {
        if (this.iterated >= this.batchSize) {
            return null;
        }
        const result = this.batch.get(this.iterated, bson_1.BSONType.object, true) ?? null;
        this.iterated += 1;
        if (options?.raw) {
            return result.toBytes();
        }
        else {
            return result.toObject(options);
        }
    }
    clear() {
        this.iterated = this.batchSize;
    }
    pushMany() {
        throw new Error('pushMany Unsupported method');
    }
    push() {
        throw new Error('push Unsupported method');
    }
}
/**
 * This supports a feature of the FindCursor.
 * It is an optimization to avoid an extra getMore when the limit has been reached
 */
CursorResponse.emptyGetMore = { id: new bson_1.Long(0), length: 0, shift: () => null };
exports.CursorResponse = CursorResponse;
//# sourceMappingURL=responses.js.map