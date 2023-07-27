import {atom} from "recoil"
type userDetails = {
    username:string,
    password:string
}
export const userAtom = atom<Array<userDetails>>({
    key:"userAtom",
    default:[{
        username:"asbar@gmail.com",
        password:"123456"
    }]
})