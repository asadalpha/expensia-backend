import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

// Create a new router instance to define the auth routes

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;
