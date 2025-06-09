
import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await storage.getUserById(userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
}
