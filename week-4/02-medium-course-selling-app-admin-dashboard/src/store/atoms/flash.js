import {atom} from 'recoil';

export const flashState = atom({
    key: 'flashState', // unique ID (with respect to other atoms/selectors)
    default: {
        open: false,
        message: "",
        severity: "success",
    }, // default value (aka initial value)
  });