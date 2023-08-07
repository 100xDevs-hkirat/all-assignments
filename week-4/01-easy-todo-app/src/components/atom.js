// src/atoms.js
import { atom, selector } from 'recoil';
import { baseUrl } from '../App';

export const alltodos = atom({
  key: 'alltodos',
  default: [],
});

export const getTodos = selector({
    key: "getTodos",
    get: async ({get}) => {
        const response = await fetch(`${baseUrl}/todos`, {
            method: "GET"
          });
        const data = await response.json();
        return data;
    }
})
