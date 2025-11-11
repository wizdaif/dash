import type { Request, Response, NextFunction } from "express";

export default function ownsProduct(location = "params") {
  return function (req: Request, res: Response, next: NextFunction) {
    const productId = (req as any)[location]["id"];

    if (!productId)
      return res.status(400).json({
        error: true,
        message: "Missing `id` parameter",
      });

    

    next();
  };
}
