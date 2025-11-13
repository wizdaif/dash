import type { Request, Response, NextFunction } from "express";
import { productModel } from "models/Product";

export default function validProduct(location = "params", fieldName = "id") {
  return function (req: Request, res: Response, next: NextFunction) {
    const productId = (req as any)[location][fieldName];

    if (!productId)
      return res.status(400).json({
        error: true,
        message: `Missing \`${fieldName}\` parameter`,
      });

    const productExists = productModel.exists({
      _id: productId.toString(),
    });

    if (!productExists)
      return res.status(400).json({
        error: true,
        message: "Product does not exist.",
      });

    next();
  };
}
