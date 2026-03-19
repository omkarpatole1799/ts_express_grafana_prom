// src/server.ts
import * as dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import express, { Application, Request, Response } from "express";
import errorHandler from "./middlewares/errorHandler";
import indexRouter from "./routes/index.routes";
import connectMongo from "./utils/db.connect";
dotenv.config({
  path: "./.env",
});

const app: Application = express();
const port: number | string = process.env["PORT"] || 3000;

(async () => {
  await connectMongo();
})();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/api", indexRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
