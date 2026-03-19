import { NextFunction, Request, RequestHandler, Response } from "express";

type ControllerResponsee<T = any> = {
  message: string;
  data: T;
};

type AsyncRequest<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<ControllerResponsee<T>>;

const tryCatch = (fn: AsyncRequest) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res, next);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
};

export default tryCatch;
