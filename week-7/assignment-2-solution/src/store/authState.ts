import { atom } from "recoil";
import { UsernameToken } from "../types";

export const authState = atom<UsernameToken>({
  key: "authState",
  default: { username: undefined, token: undefined },
});
