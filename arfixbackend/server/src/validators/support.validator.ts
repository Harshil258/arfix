import { body, param, query, ValidationChain } from "express-validator";
import { SupportMessageStatus } from "@/types/Support";

export const createSupportMessageValidator: ValidationChain[] = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 200 })
    .withMessage("Subject cannot exceed 200 characters"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 10000 })
    .withMessage("Message cannot exceed 10000 characters"),
];

export const listSupportMessagesQueryValidator: ValidationChain[] = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "status"])
    .withMessage("Invalid sortBy"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be asc or desc"),

  query("status")
    .optional()
    .isIn(Object.values(SupportMessageStatus))
    .withMessage("Invalid status filter"),

  query("unreadOnly")
    .optional()
    .isIn(["true", "false"])
    .withMessage("unreadOnly must be true or false"),
];

export const listMySupportMessagesQueryValidator: ValidationChain[] = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "status"])
    .withMessage("Invalid sortBy"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be asc or desc"),

  query("status")
    .optional()
    .isIn(Object.values(SupportMessageStatus))
    .withMessage("Invalid status filter"),
];

export const supportMessageIdParamValidator: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid message ID"),
];

export const mySupportMessageIdParamValidator: ValidationChain[] = [
  param("messageId").isMongoId().withMessage("Invalid message ID"),
];

export const updateSupportMessageValidator: ValidationChain[] = [
  ...supportMessageIdParamValidator,

  body("status")
    .optional()
    .isIn(Object.values(SupportMessageStatus))
    .withMessage("Invalid status"),

  body("isReadByStaff")
    .optional()
    .isBoolean()
    .withMessage("isReadByStaff must be a boolean"),
];
