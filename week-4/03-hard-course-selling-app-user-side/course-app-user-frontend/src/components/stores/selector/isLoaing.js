import { selector } from "recoil";
import { userState } from "../atoms/user";

export const isLoading = selector({
    key: "isLoading",
    get: ({ get }) => {
        const state = get(userState);
        return state.isLoading;
    }
});