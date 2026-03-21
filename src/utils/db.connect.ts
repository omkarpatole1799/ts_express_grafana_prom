import { Db, MongoClient } from "mongodb";
import { log } from "node:console";

import * as dotenv from "dotenv";
import ApiError from "./api-error";
dotenv.config({
  path: "./.env",
});

let db: Db;

const connectMongo = async () => {
  try {
    const url = process.env.MONGO_URL as string;
    if (url?.trim() === "") {
      throw new ApiError(400, "Invalid or no mongo url found");
    }
    const client = new MongoClient(url, {
      tls: true,
    });
    log(`Connecting with mongo...`);
    await client.connect();

    db = client.db(); // getting db
    log(`Connected with db`);
  } catch (error: unknown) {
    log(`Error connecting with db`);
    if (error instanceof Error) {
      log(error?.message);
    } else {
      log(`Unknown error mongo connect. Process exit with status code 1`);
    }
    log(error);
    process.exit(1);
  }
};

export const getDb = () => {
  if (!db) throw new ApiError(404, "No db connection found");
  return db;
};

export default connectMongo;
