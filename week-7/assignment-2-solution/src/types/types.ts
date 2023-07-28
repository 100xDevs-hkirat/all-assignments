export interface auth { 
    token: string;
    username: string;
}

export interface Token { 
    token: string;
}

export interface Todo { 
    title: string,
    description: string,
    _id: string
    done: boolean
    userID: string
    __v: number 
}

