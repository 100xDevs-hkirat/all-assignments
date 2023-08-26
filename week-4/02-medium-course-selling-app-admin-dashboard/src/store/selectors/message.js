import { flashState } from "../atoms/flash";
import {selector} from "recoil";

export const message = selector({
    key: 'messageState',
    get: ({get}) => {
      const state = get(flashState);
      return state.message;
    },
  });

