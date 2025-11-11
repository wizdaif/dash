import type { Request, Response, NextFunction } from "express";

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
  next();
}
