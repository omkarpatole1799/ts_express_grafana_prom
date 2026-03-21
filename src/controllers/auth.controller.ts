import { Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import tryCatch from "../utils/tryCatch";
import ApiError from "../utils/api-error";
import { getDb } from "../utils/db.connect";

const login = tryCatch(async (rq: Request, rs: Response) => {
  const { username, password }: { username: string; password: string } =
    rq.body;

  if (!username || username?.trim() === "") {
    throw new ApiError(400, "Invalid username");
  }

  if (
    !password ||
    password?.trim() === "" ||
    password.length >= 8 ||
    password.length <= 16
  ) {
    throw new ApiError(400, "Invalid password");
  }

  // getDb().collection("users").

  return new ApiResponse("Login successful", {});
});
