
export interface IResTodo extends ITodo{

}

export interface ITodo {
    title: string;
    description: string;
    _id: string | number;
    done?: boolean;
}

export interface IUser extends Partial<IAuth> {
    username: string | null;
}

export interface IAuth {
    username: string | null;
    password?: string;
    token: string | undefined | null;
}