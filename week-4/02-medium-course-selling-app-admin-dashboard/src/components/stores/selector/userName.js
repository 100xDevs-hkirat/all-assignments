import { selector } from "recoil";
import { userState } from "../atoms/user";

export const userName = selector({
    key: "userName",
    get: ({ get }) => {
        const state = get(userState);
        return state.userName;
    }
})