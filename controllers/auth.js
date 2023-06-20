import jwt from "jsonwebtoken";
import { mySecret } from "../app.js";

export const createAccessToken = (user) => {
  return jwt.sign(JSON.stringify(user), mySecret.secretKey);
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, mySecret.secretKey);
};
