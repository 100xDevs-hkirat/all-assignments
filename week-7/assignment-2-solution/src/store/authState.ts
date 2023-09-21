import { atom } from 'recoil';

interface AuthState {
  token: string,
  username: string
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: { token: '', username: '' },
});