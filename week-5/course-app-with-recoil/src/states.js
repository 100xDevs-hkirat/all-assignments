import { atom } from "recoil";

export const coursesState = atom({
  key: "coursesState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
