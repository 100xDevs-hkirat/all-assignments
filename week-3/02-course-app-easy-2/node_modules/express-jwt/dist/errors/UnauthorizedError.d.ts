export type ErrorLike = Error | {
    message: string;
};
type ErrorCode = 'credentials_bad_scheme' | 'credentials_bad_format' | 'credentials_required' | 'invalid_token' | 'revoked_token';
export declare class UnauthorizedError extends Error {
    readonly status: number;
    readonly inner: ErrorLike;
    readonly code: string;
    constructor(code: ErrorCode, error: ErrorLike);
}
export {};
