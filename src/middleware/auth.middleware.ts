import Jwt from "jsonwebtoken";
import { logger } from "../app.js";
import { Response, NextFunction } from "express";
import { UserRequest } from "../interfaces/user.interface.js";


const authentication = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send({
      success: false,
      message: "Authentication error",
    });
  }
  const tokenSecret = process.env.TOKEN_SECRET;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return;
  if (!tokenSecret) return;
  Jwt.verify(token, tokenSecret, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(403).send({
        success: false,
        message: "Authentication failed",
      });
    }
    //@ts-ignore
    req.user = user;
    next();
  });
};



export default authentication;