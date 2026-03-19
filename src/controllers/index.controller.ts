import { log } from "node:console";
import ApiResponse from "../utils/api-response";
import tryCatch from "../utils/tryCatch";
import ApiError from "../utils/api-error";

const register = tryCatch(async (req, res, next) => {
  const { name, age } = req.body;
  if (name?.trim() === "" || !name) {
    throw new ApiError(400, "Name required");
  }
  if (!age || !isNaN(age)) {
    throw new ApiError(400, "Invalid age");
  }
  return new ApiResponse("Hi", {
    name,
    age,
  });
});

export { register };
