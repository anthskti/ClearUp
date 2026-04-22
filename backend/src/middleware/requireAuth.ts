import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth";

export type AppRole = "user" | "admin";

export type AuthenticatedUser = {
  id: string;
  email?: string;
  role?: AppRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// For standard logged-in users, like saving routines
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = session.user; 
  next();
};

// For admin features, like CSV uploads
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userWithRole = session.user as typeof session.user & { role?: AppRole };

  if (userWithRole.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  req.user = session.user; 
  next();
};