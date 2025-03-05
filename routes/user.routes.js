import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

// GET /users -> get all users
// GET /users/:id -> get user by id
// POST /users -> create a new user
// PUT /users/:id -> update user by id

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.post("/", (req, res) => {
  res.send({ title: "CREATE new user" });
});

userRouter.put("/:id", (req, res) => {
  res.send({ title: "UPDATE all user" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETE user" });
});

export default userRouter;
