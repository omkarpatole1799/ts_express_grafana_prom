import { log } from "node:console";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import { getDb } from "../utils/db.connect";
import tryCatch from "../utils/tryCatch";

const register = tryCatch(async (req, res, next) => {
  const { name, age } = req.body;
  log(name, age);

  if (name?.trim() === "" || !name) {
    throw new ApiError(400, "Name required");
  }
  if (!age || isNaN(age)) {
    throw new ApiError(400, "Invalid age");
  }

  const newUser = await getDb().collection("users").insertOne({
    name,
    age,
  });

  console.log(newUser, "-newUser");

  return new ApiResponse("Successfully created new user", {
    userId: newUser.insertedId,
  });
});

export { register };
