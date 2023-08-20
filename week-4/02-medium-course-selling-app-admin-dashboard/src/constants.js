export const BASE_URL = 'http://localhost:3000'

export const isStrongPassword = password => {
  // Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}
