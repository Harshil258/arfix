import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import config from "../config/app.config";
import { MongoError } from "@/types/Common";


const handleMongooseDuplicateKey = (err: MongoError): AppError => {
  const field = Object.keys(err.keyValue ?? {})[0];
  return new AppError(`An account with that ${field} already exists.`, 409);
};

const handleMongooseValidation = (err: Error): AppError => {
  return new AppError(err.message, 400);
};

const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Your session has expired. Please log in again.", 401);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  // Transform known error types into AppErrors
  const mongoErr = err as MongoError;
  if (mongoErr.code === 11000) error = handleMongooseDuplicateKey(mongoErr);
  if (err.name === "ValidationError") error = handleMongooseValidation(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  const appError = error instanceof AppError ? error : new AppError("Internal server error", 500, false);

  const isDev = config.nodeEnv === "development";

  res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    ...(isDev && !appError.isOperational && { stack: appError.stack }),
  });
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
