
export interface IResTodo extends ITodo{

}

export interface ITodo {
    title: string;
    description: string;
    id: string | number;
}

export interface IUser extends Partial<IAuth> {
    
}

export interface IAuth {
    username: string | null;
    password?: string;
    token: string | undefined | null;
}