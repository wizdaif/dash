import type { Request, Response, NextFunction } from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers["authorization"] ?? "Bearer ";
  const [_, token] = authorization.split(" ");

  const apiKey = req.headers["x-api-key"];

  if (!token && !apiKey)
    return res.status(400).json({
      error: true,
      message: "Missing `Authorization` header",
    });

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      req.locals = req.locals ?? { admin: false, userId: null };
      req.locals.userId = decoded.sub!;
      req.locals.data = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }
  } else {
    if (apiKey && apiKey === process.env.API_KEY) {
      req.locals = { admin: true, userId: null, data: {} };
      next();
    }

    return res.status(401).json({
      error: true,
      message: "Unauthorized",
    });
  }
}