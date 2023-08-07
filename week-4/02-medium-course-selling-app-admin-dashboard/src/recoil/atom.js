import { atom } from 'recoil'

export const user = atom({
    key: "user",
    default: {},
});

export const loading = atom({
    key: "loading",
    default: false
})