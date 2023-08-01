import { atom, selector } from 'recoil';

export const counterState = atom({
    key: 'counterState',
    default: 0,
}); 

export const doubledCounterState = selector({
    key: 'doubledCounterState',
    get: ({ get }) => {
        const counter = get(counterState);
        return counter * 2;
    }
});