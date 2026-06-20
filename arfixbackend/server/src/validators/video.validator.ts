import { body, ValidationChain } from "express-validator";

const extractYoutubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const createVideoValidator: ValidationChain[] = [
  body("url")
    .trim()
    .notEmpty().withMessage("YouTube URL is required")
    .custom((value: string) => {
      const youtubeId = extractYoutubeId(value);
      if (!youtubeId) {
        throw new Error("Please provide a valid YouTube video URL");
      }
      return true;
    }),
  body("title")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
];
