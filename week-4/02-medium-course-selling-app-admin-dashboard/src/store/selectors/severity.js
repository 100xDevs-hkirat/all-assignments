import { flashState } from "../atoms/flash";
import {selector} from "recoil";


export const severity = selector({
    key: 'severityState',
    get: ({get}) => {
        const state = get(flashState);
        return state.severity;
    },
    });