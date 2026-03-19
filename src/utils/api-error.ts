import { log } from "node:console";

class ApiError extends Error {
  public status: number;
  public errors: unknown[];

  constructor(
    status: number,
    message: string = "Something went wrong!!!",
    stack?: string,
    errors: unknown[] = [],
  ) {
    super(message);
    this.name = 'ApiError'
    this.status = status;
    this.errors = errors;


    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError