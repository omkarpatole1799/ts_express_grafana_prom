import express from "express";

const authRouter = express.Router();

authRouter.post("/login");

authRouter.post("/logout");

export default authRouter;
