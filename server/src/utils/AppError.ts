export interface AppErrorOptions {
  cause?: Error;
}

export default class AppError extends Error {
  public statusCode: number;
  public status: "fail" | "error";
  public isOperational: boolean;
  public cause?: Error;

  constructor(
    message: string,
    statusCode: number,
    options: AppErrorOptions = {}
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    if (options.cause instanceof Error) {
      this.cause = options.cause;
      this.stack = options.cause.stack;
    }

    this.name = this.constructor.name;

    if (!options.cause) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
