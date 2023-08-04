import jwt from "jsonwebtoken";
import { ADMIN_SECRECT, USER_SECRECT } from "../config/config.js";

function generate_Admin_Jwt(payload) {
  let { email, _id } = payload;
  let token = jwt.sign({ email: email, _id: _id }, ADMIN_SECRECT, {
    expiresIn: "1h",
  });
  return token;
}

function generate_User_Jwt(payload) {
  let { email, _id } = payload;
  let token = jwt.sign({ email: email, _id: _id }, USER_SECRECT, {
    expiresIn: "1h",
  });
  return token;
}

export { generate_Admin_Jwt, generate_User_Jwt };
