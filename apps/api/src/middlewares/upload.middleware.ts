import multer from "multer";
import { ApiError } from "../utils/api-error";

const allowedMimeTypes = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new ApiError(
          400,
          "Invalid file type. Only PDF, TXT, Markdown, and DOCX files are allowed."
        )
      );
    }

    callback(null, true);
  },
});