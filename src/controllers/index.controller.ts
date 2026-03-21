import { log } from "node:console";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import { getDb } from "../utils/db.connect";
import tryCatch from "../utils/tryCatch";

const register = tryCatch(async (req, res, next) => {
  const { name, age, password } = req.body;
  log(name, age);

  if (name?.trim() === "" || !name) {
    throw new ApiError(400, "Name required");
  }
  if (!age || isNaN(age) || age >= 60 || age <= 18) {
    throw new ApiError(400, "Invalid age");
  }
  if (
    !password ||
    password?.trim() === "" ||
    password?.trim()?.length >= 8 ||
    password?.trim()?.length <= 16
  ) {
    
  }

  const newUser = await getDb().collection("users").insertOne({
    name,
    age,
  });

  return new ApiResponse("Successfully created new user", {
    userId: newUser.insertedId,
  });
});

export { register };
