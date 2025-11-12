import { getConfig } from "@utils";
import type { Request, Response, NextFunction } from "express";

export default async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.locals.admin) next();

  if (!req.locals || !req.locals.userId)
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
    });

  const config = await getConfig();

  if (!config.admins.includes(req.locals.userId))
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
    });

  next();
}
