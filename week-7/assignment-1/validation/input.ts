import { z } from 'zod';
// does not match username containing numbers
const usernameRegex = new RegExp('^([^0-9]*)$')
const passwordRegex = new RegExp('[A-Z]')

export const Username = z.string().min(4).max(12).regex(usernameRegex)
export const Password = z.string().min(8).max(22).regex(passwordRegex)
