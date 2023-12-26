import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
export const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("err jwt");
      return false;
    } else {
      console.log("jwt decoded", decoded);
      return decoded;
    }
  });
};
