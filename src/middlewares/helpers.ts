import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const abort = (res: Response, code: number, msg?: string) => {
  switch (code) {
    case 422:
      res
        .status(422)
        .json({ success: false, error: 422, message: "unprocessable" });
      break;
    case 405:
      res
        .status(405)
        .json({ success: false, error: 405, message: "method not allowed" });
      break;
    case 400:
      res.status(400).json({
        success: false,
        error: 400,
        message: "bad request",
      });
      break;
    case 404:
      res.status(404).json({
        success: false,
        error: 404,
        message: msg ? msg : "ressource not found",
      });
      break;
    case 401:
      res.status(401).json({
        success: false,
        error: 401,
        message:  msg ? msg :  "not authorized",
      });
      break;
    default:
      res.status(500).json({
        success: false,
        error: 500,
        message: "something went wrong, try again later...",
      });
  }
};

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(" ")[1];
    // @ts-ignore
    jwt.verify(token, process.env.TOKEN_SECRET);

    next();
  } catch (error) {
    abort(res, 401);
  }
};

export { abort, verifyAuthToken };
