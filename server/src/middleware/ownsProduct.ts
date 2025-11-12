import type { Request, Response, NextFunction } from "express";
import { userModel } from "models/User";

export default function ownsProduct(location = "params") {
  return function (req: Request, res: Response, next: NextFunction) {
    const productId = (req as any)[location]["id"];

    if (!productId)
      return res.status(400).json({
        error: true,
        message: "Missing `id` parameter",
      });

    const userId = req.locals.userId!;

    const ownsProduct = userModel.exists({
      _id: userId.toString(),
      "products.id": productId.toString()
    });

    if (!ownsProduct)
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });

    next();
  };
}
