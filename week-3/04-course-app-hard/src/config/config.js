import * as dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const DB_URL = process.env.DB_URL;
const ADMIN_SECRECT = process.env.ADMIN_SECRECT;
const USER_SECRECT = process.env.USER_SECRECT;
const ADMIN_SALT = bcrypt.genSaltSync(process.env.ADMIN_SALT);
const USER_SALT = bcrypt.genSaltSync(process.env.USER_SALT);

export { DB_URL, ADMIN_SECRECT, USER_SECRECT, ADMIN_SALT, USER_SALT };
