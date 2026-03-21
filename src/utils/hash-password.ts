import projectConfigs from "./configs";
import bcrypt from "bcrypt";

const hashPassword = (password: string) => {
  if (!password) {
    throw new Error("Invalid password");
  }

  return new Promise((res, rej) => {
    bcrypt.hash(
      password,
      projectConfigs.saltRounds,
      function (err: Error, hash: string) {
        if (err) rej(err?.message || "Unable to has password");
        res(hash);
      },
    );
  });
};

const comparePassword = (plainTextPassword: string, hashedPassword: string) => {
  if (!plainTextPassword || !hashedPassword) {
    throw new Error("Invalid password");
  }

  return new Promise((res, rej) => {
    bcrypt.compare(
      plainTextPassword,
      hashPassword,
      function (err: Error, result: string) {
        if (err || !result) rej(false);
        res(result);
      },
    );
  });
};
