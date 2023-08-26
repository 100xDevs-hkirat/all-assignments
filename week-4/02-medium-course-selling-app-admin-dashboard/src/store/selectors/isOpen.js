import { flashState } from "../atoms/flash";
import {selector} from "recoil";

export const isOpen = selector({
  key: 'isOpenState',
  get: ({get}) => {
    const state = get(flashState);
    return state.open;
  },
});