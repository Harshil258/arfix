export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Convenience factories
export const BadRequestError = (msg: string) => new AppError(msg, 400);
export const UnauthorizedError = (msg: string) => new AppError(msg, 401);
export const ForbiddenError = (msg: string) => new AppError(msg, 403);
export const NotFoundError = (msg: string) => new AppError(msg, 404);
export const ConflictError = (msg: string) => new AppError(msg, 409);
export const InternalError = (msg: string) => new AppError(msg, 500, false);
