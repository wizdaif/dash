import type { Request, Response, NextFunction } from "express";

import * as z from "zod";

export default function validateData(schema: z.ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));

        res.status(400).json({
          error: true,
          message: "Invalid data",
          details: errorMessages,
        });
      } else {
        res.status(500).json({ error: true, message: "Internal Server Error" });
      }
    }
  };
}
