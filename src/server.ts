import * as dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import express, { Application, NextFunction, Request, Response } from "express";
import errorHandler from "./middlewares/errorHandler";
import indexRouter from "./routes/index.routes";
import connectMongo from "./utils/db.connect";
import addPromClient from "./utils/add-prom-client";
dotenv.config({
  path: "./.env",
});

const app: Application = express();
const port: number | string = process.env["PORT"] || 3000;

import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

(async () => {
  await connectMongo();
})();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/api", indexRouter);

app.get("/metrics", async (rq: Request, rs: Response, next: NextFunction) => {
  rs.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  rs.send(metrics);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
