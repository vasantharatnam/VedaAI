import { NextFunction, Request, Response } from "express"

export const notFoundHandler = (req: Request , res: Response, _next:NextFunction) => {
     res.status(404).json({
         success: false,
         message: `Route not found: ${req.method} ${req.originalUrl}`,
     });
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("API Error:", error);

  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};