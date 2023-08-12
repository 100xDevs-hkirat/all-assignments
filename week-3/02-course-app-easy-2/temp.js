require('dotenv').config();

const adminSecretKey = process.env.ADMIN_JWT_SECRET_KEY;
const userSecretKey = process.env.USER_JWT_SECRET_KEY;

console.log(userSecretKey);
console.log(adminSecretKey);
