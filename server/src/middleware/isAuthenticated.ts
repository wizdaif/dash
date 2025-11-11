import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers["authorization"] ?? "Bearer ";
  const [_, token] = authorization.split(" ");

  const apiKey = req.headers['x-api-key']

  if (!token || !apiKey)
    return res.status(400).json({
      error: true,
      message: "Missing `Authorization` header",
    });

  if (token) {
    try {
      const decoded =  jwt.verify(token, process.env.JWT_SECRET);

      
    } catch (error) {

    }
  } else if (apiKey) {

  }

  next();
}
