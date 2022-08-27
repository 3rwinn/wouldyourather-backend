import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { abort, verifyAuthToken } from "../middlewares/helpers";

dotenv.config();

const { TOKEN_SECRET } = process.env;

import { User, UserAuth, UserStore } from "../models/user";

const UserController = (app: express.Application) => {
  app.post("/users", create);
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.delete("/users/:id", verifyAuthToken, destroy);
  app.post("/users/authenticate", authenticate);
};

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json({
    success: true,
    users,
  });
};

const show = async (_req: Request, res: Response) => {
  const id = parseInt(_req.params.id);
  const user = await store.show(id);
  if (user) {
    res.json({ success: true, user });
  } else {
    abort(res, 404, "User not found");
  }
};

const create = async (_req: Request, res: Response) => {
  const user: User = {
    name: _req.body.name,
    email: _req.body.email,
    password: _req.body.password,
  };
  try {
    // @TODO: find user by email to check if email already exist!
    const userAlreadyExist = await store.findUserByEmail(user.email);
    if (userAlreadyExist) {
      abort(res, 406, "An user with this email address already exists!");
    } else {
      await store.create(user);

      res.json({
        success: true,
        userCreated: true,
      });
    }
  } catch (err) {
    console.log("pelo", err);
    abort(res, 400);
  }
};
const destroy = async (_req: Request, res: Response) => {
  const id = parseFloat(_req.params.id);
  const deleted = await store.delete(id);
  if (deleted) {
    res.json({
      success: true,
      deleted,
    });
  } else {
    abort(res, 404, "User not found");
  }
};

const authenticate = async (_req: Request, res: Response) => {
  const user: UserAuth = {
    email: _req.body.email,
    password: _req.body.password,
  };
  try {
    const u = await store.authenticate(user.email, user.password);
    if (u === null) {
      abort(res, 401, "Invalid credentials");
    } else {
      // @ts-ignore
      var token = jwt.sign({ user: u }, TOKEN_SECRET);
      res.json({
        success: true,
        token: token,
        name: u.name,
        email: u.email,
      });
    }
  } catch (err) {
    abort(res, 400, err as string);
  }
};

export default UserController;
