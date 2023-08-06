export interface IUser {
    username: string | null,
    token: string | null,
    name?: string | null,
    cart?: object,
    orders?: object,
}