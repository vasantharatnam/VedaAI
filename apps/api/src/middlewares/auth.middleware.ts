import { NextFunction, Request, Response } from "express";
import { verifyToken } from "@clerk/backend";
import { env } from "../config/env";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
    }
  }
}

const getBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!env.clerkSecretKey) {
      res.status(500).json({
        success: false,
        message: "Clerk secret key is not configured",
      });
      return;
    }

    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const payload = await verifyToken(token, {
      secretKey: env.clerkSecretKey,
    });

    req.auth = {
      userId: payload.sub,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
