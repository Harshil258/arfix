import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiResponse, ValidationError } from "../types/User";

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors: ValidationError[] = errors.array().map((err) => ({
      field: err.type === "field" ? err.path : "unknown",
      message: err.msg as string,
    }));

    const response: ApiResponse = {
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    };

    res.status(422).json(response);
    return;
  }

  next();
};
