import { atom } from 'recoil'

interface IAuthState {
  token: string | null
  username: string | null
}

export const authState = atom({
  key: 'authState',
  default: { token: '', username: null } as IAuthState,
})
